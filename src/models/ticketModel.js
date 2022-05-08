class Ticket {
    constructor(ticketId, userId, status, description, notes, handlerId, expertises, hardwares, softwares, oses, createdAt) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.status = status;
        this.description = description;
        this.notes = notes;
        this.handlerId = handlerId;
        this.expertises = expertises;
        this.hardwares = hardwares;
        this.softwares = softwares;
        this.oses = oses;
        this.createdAt = createdAt;
    }

    static async #getEquipment(conn, equipmentType, id) {
        let query = await conn.query(
            `SELECT ${equipmentType}.${equipmentType}_serial AS serial, ${equipmentType}.name AS name
             FROM ticket_${equipmentType}
                      INNER JOIN ${equipmentType}
                                 ON ticket_${equipmentType}.${equipmentType}_serial = ${equipmentType}.${equipmentType}_serial
             WHERE ticket_id = ?`,
            [id]
        );

        return query.map(equipment => {
            return {"serial": equipment.serial, "name": equipment.name}
        });
    }

    static async #augmentTicket(conn, ticket) {
        let id = ticket.ticketId;

        let expertiseQuery = await conn.query(
            `SELECT expertise.name AS name
             FROM ticket_expertise
                      INNER JOIN expertise ON ticket_expertise.expertise_id = expertise.expertise_id
             WHERE ticket_id = ?`,
            [id]
        );
        ticket.expertises = expertiseQuery.map(expertise => expertise.name);

        ticket.hardwares = await this.#getEquipment(conn, "hardware", id);
        ticket.softwares = await this.#getEquipment(conn, "software", id);
        ticket.oses = await this.#getEquipment(conn, "os", id);

        return ticket;
    }

    static async getById(conn, id) {
        let ticketResult = await conn.query(
            `SELECT ticket_id AS ticketId, user_id AS userId, status, description, notes, handler_id AS handlerId, created_at AS createdAt
             FROM ticket
             WHERE ticket_id = ?`,
            [id]
        );

        let ticket = ticketResult[0];
        ticket = await this.#augmentTicket(conn, ticket);

        return new Ticket(
            ticket.ticketId,
            ticket.userId,
            ticket.status,
            ticket.description,
            ticket.notes,
            ticket.handlerId,
            ticket.expertises,
            ticket.hardwares,
            ticket.softwares,
            ticket.oses,
            ticket.createdAt
        );
    }

    static async getAll(conn,
                        skip, limit,
                        filterColumn = null, filterValue = null,
                        sortColumn = null, sortType = null) {
        let queryString =
            `SELECT ticket_id AS ticketId, user_id AS userId, status, description, notes, handler_id AS handlerId, created_at AS createdAt
             FROM ticket`;
        let queryParams = [];

        console.log(filterColumn);
        console.log(filterValue);

        if (filterColumn !== null) {
            if (filterValue !== null) {
                queryString += `\n WHERE ${filterColumn} = ?`;
                queryParams.push(filterValue);
            } else {
                queryString += `\n WHERE ${filterColumn} IS NULL`;
            }
        }

        if (sortColumn !== null)
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let tickets = await conn.query(queryString, queryParams);
        tickets = await Promise.all(
            tickets.map(ticket => this.#augmentTicket(conn, ticket))
        );

        return tickets.map(
            ticket => new Ticket(
                ticket.ticketId,
                ticket.userId,
                ticket.status,
                ticket.description,
                ticket.notes,
                ticket.handlerId,
                ticket.expertises,
                ticket.hardwares,
                ticket.softwares,
                ticket.oses,
                ticket.createdAt
            )
        );
    }

    static async create(conn, userId, status, description, notes, handlerId, createdAt) {
        // ticketId is not going to be used for the creation because it is auto incrementing.
        // Hardware/software/OS are separate to the ticket table, so they are handled in their
        // own respective models.
        let queryString = `
            INSERT INTO ticket (user_id, status, description, notes, handler_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        let queryParams = [userId, status, description, notes, handlerId, createdAt];

        await conn.query(queryString, queryParams);
    }

    static async updateById(conn,
                            ticketId,
                            userId = null,
                            status = null,
                            description = null,
                            notes = null,
                            handlerId = null) {
        let queryString = "UPDATE ticket SET ticket_id = ?";
        let queryParams = [ticketId];

        const addToQuery = (param, name) => {
            if (param != null) {
                queryString += `, ${name} = ? `;
                queryParams.push(param)
            }
        };

        addToQuery(userId, "user_id");
        addToQuery(status, "status");
        addToQuery(description, "description");
        addToQuery(notes, "notes");
        addToQuery(handlerId, "handler_id");

        queryString += "WHERE ticket_id = ?";
        queryParams.push(ticketId)

        await conn.query(queryString, queryParams);
    }
}

module.exports = Ticket;
// The Ticket model contains information about a ticket in the system
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
    // Function to get equipment related to a ticket specified by ticket id
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
    // Function that adds extra information to a Ticket object
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
    // Function that get a ticket using its ID
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
    // Get the total amount of tickets that exist in the system
    /**
    * Gets count of tickets with filter options
    * @param {list} filterColumns table columns to filter
    * @param {list} filterValues values selected in columns to filter
    * @param {list} filterOperator query operators to seperate each filter option (e.g. AND, OR)
    */
    static async getCount(conn, filterColumns = [], filterValues = [], filterOperator = []) {
        let queryString = `SELECT COUNT(ticket_id) AS count FROM ticket`
        let queryParams = [];

        if (filterColumns.length != 0) {
            queryString += ` WHERE`;
            filterColumns.forEach((filter, i) => {
                if (filterValues[i] !== null) {
                    queryString += ` ${filter} = ? ${filterOperator[i]}`;
                    queryParams.push(filterValues[i]);
                } else {
                    queryString += ` ${filter} IS NULL ${filterOperator[i]}`;
                }
            });
        }

        let tickets = await conn.query(queryString, queryParams);
        return tickets[0].count;
    }
    // Get all tickets in the system
    static async getAll(conn,
                        skip, limit,
                        filterColumns = [], filterValues = [], filterOperator = [],
                        sortColumn = null, sortType = null, search = null) {
        let queryString =
            `SELECT ticket_id AS ticketId, user_id AS userId, status, description, notes, handler_id AS handlerId, created_at AS createdAt
             FROM ticket`;
        let queryParams = [];

        if (filterColumns.length != 0) {
            queryString += ` WHERE`;
            filterColumns.forEach((filter, i) => {
                if (filterValues[i] === 'isNotNull'){
                    queryString += ` ${filter} IS NOT NULL ${filterOperator[i]}`;
                }  
                else if (filterValues[i] !== null) {
                    queryString += ` ${filter} = ? ${filterOperator[i]}`;
                    queryParams.push(filterValues[i]);
                } else {
                    queryString += ` ${filter} IS NULL ${filterOperator[i]}`;
                }
            });

            if(search !== null){
                queryString += `AND (ticket_id LIKE '%${search}%' or user_id LIKE '%${search}%' or status LIKE '%${search}%' or 
                description LIKE '%${search}%' or notes LIKE '%${search}%' or handler_id LIKE '%${search}%' or created_at LIKE '%${search}%')`;
            }
        }

        // if (filterColumn !== null) {
        //     if (filterValue === 'isNotNull'){
        //         queryString += `\n WHERE ${filterColumn} IS NOT NULL`;
        //     }
        //      else if (filterValue !== null) {
        //         queryString += `\n WHERE ${filterColumn} = ?`;
        //         queryParams.push(filterValue);
        //     } 
        //     else {
        //         queryString += `\n WHERE ${filterColumn} IS NULL`;
        //     }

        //     if(search !== null){
        //         queryString += `AND (ticket_id LIKE '%${search}%' or user_id LIKE '%${search}%' or status LIKE '%${search}%' or 
        //         description LIKE '%${search}%' or notes LIKE '%${search}%' or handler_id LIKE '%${search}%' or created_at LIKE '%${search}%')`;
        //     }
        // }

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
    // Function that allows for creation of a ticket
    static async create(conn, userId, status, description, notes, handlerId, createdAt) {
        // ticketId is not going to be used for the creation because it is auto incrementing.
        // Hardware/software/OS are separate to the ticket table, so they are handled in their
        // own respective models.
        let queryString = `
            INSERT INTO ticket (user_id, status, description, notes, handler_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        let queryParams = [userId, status, description, notes, handlerId, createdAt];

        let results = await conn.query(queryString, queryParams);
        return results.insertId;
    }
    // Function to update a ticket specified by its ID
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
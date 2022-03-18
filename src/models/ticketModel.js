class Ticket {
    constructor(ticketId, userId, status, description, notes, handlerId, expertises, hardwares, softwares, oses) {
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
    }

    static async #getEquipment(conn, equipmentType, id) {
        return await conn.query(
            `SELECT ${equipmentType}.${equipmentType}_serial AS serial, ${equipmentType}.name AS name
             FROM ticket_${equipmentType}
                      INNER JOIN ${equipmentType}
                                 ON ticket_${equipmentType}.${equipmentType}_serial = ${equipmentType}.${equipmentType}_serial
             WHERE ticket_id = ?`,
            [id]
        ).map(equipment => {
            return {"serial": equipment.serial, "name": equipment.name}
        });
    }

    static async getAll(conn) {
        let tickets = await conn.query(
            `SELECT ticket_id AS ticketId, user_id AS userId, status, description, notes, handler_id AS handlerId
             FROM ticket`
        );

        for (const ticket in tickets) {
            let id = ticket.ticketId;
            ticket.expertises = await conn.query(
                `SELECT expertise.name AS name
                 FROM ticket_expertise
                          INNER JOIN expertise ON ticket_expertise.expertise_id = expertise.expertise_id
                 WHERE ticket_id = ?`,
                [id]
            ).map(expertise => expertise.name);

            ticket.hardwares = this.#getEquipment(conn, "hardware");
            ticket.softwares = this.#getEquipment(conn, "software");
            ticket.oses = this.#getEquipment(conn, "os");
        }

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
                ticket.oses
            )
        );
    }
}

module.exports = Ticket;
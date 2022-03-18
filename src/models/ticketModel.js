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
        let query = await conn.query(
            `SELECT hardware.hardware_serial AS serial, hardware.name AS name
             FROM ticket_hardware
                      INNER JOIN hardware
                                 ON ticket_hardware.hardware_serial = hardware.hardware_serial
             WHERE ticket_id = ?`,
            [id]
        );

        return query.map(equipment => {
            return {"serial": equipment.serial, "name": equipment.name}
        });
    }

    static async getAll(conn) {
        let tickets = await conn.query(
            `SELECT ticket_id AS ticketId, user_id AS userId, status, description, notes, handler_id AS handlerId
             FROM ticket`
        );

        for (const ticket of tickets) {
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
            ticket.oses = await this.#getEquipment(conn, "software", id);
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
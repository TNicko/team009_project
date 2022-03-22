//- getAll
//- getBySpecialist

class Expertise {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async getAll(conn, skip, limit, filterColumn = null, filterValue = null, sortColumn = null, sortType = null) {
        let queryString = "SELECT expertise_id AS id, name FROM expertise";
        let queryParams = [];


        if (filterColumn !== null) {
            queryString += `\n WHERE ? = ?`;
            queryParams.push(filterColumn, filterValue);
        }

        if (sortColumn !== null)

            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let exepertises = await conn.query(queryString, queryParams);

        return expertises.map(
            expertise => new Expertise(expertise.id,expertise.name)
        );

    }

    static async getBySpecialist(conn,id) {
        let ExpertiseResult = await conn.query(
            `SELECT expertise.expertise_id AS id,expertise.name from expertise INNER JOIN handler_expertise ON expertise.expertise_id = handler_expertise.expertise_id
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
            ticket.oses
        );

    }

}

module.exports = Expertise;
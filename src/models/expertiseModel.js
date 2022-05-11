//The Expertise model contains information about the expertise information
//which could be hardware/software/OS

class Expertise {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // getBySpecialist() function takes in a specialist user Id as parameter and return the expertises object of the specialist
    static async getBySpecialist(conn, SpecialistId) {
        let expertises = await conn.query(
            `SELECT e.expertise_id, e.name
             FROM expertise e
                  INNER JOIN handler_expertise he ON e.expertise_id = he.expertise_id
             WHERE handler_id = ?`,
            [SpecialistId]
        );

        return expertises.map(
            expertise => new Expertise(
                expertise.id,
                expertise.name,
            )
        );
    }

    static async getForTicket(conn, ticketId) {
        let expertises = await conn.query(
            "SELECT te.expertise_id, e.name\n" +
            "FROM ticket_expertise te\n" +
            "INNER JOIN expertise e\n" +
            "ON e.expertise_id = te.expertise_id\n" +
            "WHERE ticket_id = ?",
            [ticketId]
        );

        return expertises.map(
            expertise => new Expertise(
                expertise.id,
                expertise.name,
            )
        );
    }

    static async addToTicket(conn, ticketId, expertiseName) {
        let query = await conn.query(
            "SELECT expertise_id FROM expertise WHERE name = ?",
            [expertiseName]
        );
        let expId = query[0].expertise_id;

        await conn.query(
            "INSERT INTO ticket_expertise (expertise_id, ticket_id) VALUES (?, ?)",
            [expId, ticketId]
        );

    }

    // getAll() function return all expertises in the system
    static async getAll(conn,
                        skip, limit,
                        filterColumn = null, filterValue = null,
                        sortColumn = null, sortType = null) {
        let queryString =
            `SELECT expertise_id, name
             FROM expertise`;
        let queryParams = [];

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

        let expertises = await conn.query(queryString, queryParams);

        return expertises.map(
            expertise => new Expertise(
                expertise.id,
                expertise.name,
            )
        );
    }
}

module.exports = Expertise;
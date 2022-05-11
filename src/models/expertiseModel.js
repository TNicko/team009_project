//The Expertise model cointains information about the expertises information
//which could be hardware software os 

class Expertise {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    //getBySpecialist() funtion takes in a specialist user Id as parameter and return the expertises object of the specialist
    static async getBySpecialist(conn, SpecialistId) {
        let expertises = await conn.query(
            `SELECT expertise.expertise_id, expertise.name
             FROM expertise
                  INNER JOIN handler_expertise ON expertise.expertise_id = handler_expertise.expertise_id
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
    //getAll() funtion return all expertises in the system
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
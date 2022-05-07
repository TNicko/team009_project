class Software{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }

    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null){

        let queryString = "SELECT software_serial as serial, name FROM software";
        let queryParams = [];
        
        if(search !== null){
            queryString += `\n WHERE name LIKE '%?%' \n OR software_serial LIKE '%?%'`;
            queryParams.push(search, search)
        }

        if(sortColumn !== null){
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let softwares = await conn.query(queryString, queryParams);

        return softwares.map(
            software => new Software(software.name, software.serial)
        );
    }

    static async add(conn, serial, name){
        let queryString = `INSERT INTO software (software_serial, name) \n VALUES (?,?)`;
        await conn.query(queryString, [serial, name]);
    }

    static async addToTicket(conn, serial, ticket_id){
        let queryString = `INSERT INTO ticket_software (software_serial, ticket_id) \n VALUES (?,?)`;
        await conn.query(queryString, [serial, ticket_id]);
    }

    static async deleteFromTicket(conn, serial, ticket_id){
        let queryString = `DELETE FROM ticket_software WHERE ticket_id = ? AND software_serial = ?`;
        await conn.query(queryString, [ticket_id, serial]);
    }

    static async update(conn, serial, newSerial = null, name = null){
        let queryString = `UPDATE hardware \n SET`;
        let queryParams = []

        if(newSerial !== null){
            queryString += ` software_serial = ?`;
            queryParams.push(newSerial)
        }

        if(name !== null){
            queryString += ` name = ?`;
            queryParams.push(name)
        }

        queryString += `\n WHERE software_serial = ?`;
        queryParams.push(serial)

        await conn.query(queryString, queryParams)
    }

}   

module.exports = Software
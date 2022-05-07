class Os{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }

    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null){

        let queryString = "SELECT os_serial as serial, name FROM os";
        let queryParams = [];
        
        if(search !== null){
            queryString += `\n WHERE name LIKE '%?%' \n OR os_serial LIKE '%?%'`;
            queryParams.push(search, search)
        }

        if(sortColumn !== null){
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let oss = await conn.query(queryString, queryParams);

        return oss.map(
            os => new Os(os.name, os.serial)
        );
    }
    
    static async add(conn, serial, name){
        let queryString = `INSERT INTO os (os_serial, name) \n VALUES (?,?)`;
        await conn.query(queryString, [serial, name]);
    }

    static async addToTicket(conn, serial, ticket_id){
        let queryString = `INSERT INTO ticket_os (os_serial, ticket_id) \n VALUES (?,?)`;
        await conn.query(queryString, [serial, ticket_id]);
    }

    static async deleteFromTicket(conn, serial, ticket_id){
        let queryString = `DELETE FROM ticket_os WHERE ticket_id = ? AND os_serial = ?`;
        await conn.query(queryString, [ticket_id, serial]);
    }

    static async update(conn, serial, newSerial = null, name = null){
        let queryString = `UPDATE os \n SET`;
        let queryParams = []

        if(newSerial !== null){
            queryString += ` os_serial = ?`;
            queryParams.push(newSerial)
        }
        
        if(name !== null){
            queryString += ` name = ?`;
            queryParams.push(name)
        }
        queryString += `\n WHERE os_serial = ?`;
        queryParams.push(serial)

        await conn.query(queryString, queryParams)
    }


}

module.exports = Os
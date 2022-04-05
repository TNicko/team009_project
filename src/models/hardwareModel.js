class Hardware{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }


    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null){

        let queryString = "SELECT hardware_serial as serial, name FROM hardware";
        let queryParams = [];
        
        if(search !== null){
            queryString += `\n WHERE name LIKE '%?%' \n OR hardware_serial LIKE '%?%'`;
            queryParams.push(search, search)
        }

        if(sortColumn !== null){
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let hardwares = await conn.query(queryString, queryParams);
        
        return hardwares.map(
            hardware => new Hardware(hardware.name, hardware.serial)
        );
        
        
    }

    static async add(conn, serial, name){
        let queryString = `INSERT INTO hardware (hardware_serial, name)\n VALUES (?, ?)`;
        await conn.query(queryString, [serial, name]);
    
    }

    static async addToTicket(conn, serial, ticket_id){
        let queryString = `INSERT INTO ticket_hardware (hardware_serial, ticket_id) \n VALUES (?,?)`;
        await conn.query(queryString, [serial, ticket_id]);
    }

    static async deleteFromTicket(conn, serial, ticket_id){
        let queryString = `DELETE FROM ticket_hardware WHERE ticket_id = ? and hardware_serial = ?`;
        await conn.query(queryString, [ticket_id, serial]);
    }
    
    static async update(conn, serial, newSerial = null, name = null){
        let queryString = `UPDATE hardware \n SET`;
        let queryParams = []

        if(newSerial !== null){
            queryString += ` hardware_serial = ?`;
            queryParams.push(newSerial)
        }
        
        if(name !== null){
            queryString += ` name = ?`;
            queryParams.push(name)
        }

        queryString += `\n WHERE hardware_serial = ?`;
        queryParams.push(serial)

        await conn.query(queryString, queryParams)

    }

}

module.exports = Hardware;


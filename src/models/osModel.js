//The OS model stores information about operating systems in the company
class Os {
    constructor(name, serial) {
        this.name = name
        this.serial = serial
    }

    //Retrieves all OS
    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null) {

        let queryString = "SELECT os_serial AS serial, name FROM os";
        let queryParams = [];

        if (search !== null) {
            queryString += `\n WHERE name LIKE '%${search}%' \n OR os_serial LIKE '%${search}%'`;
        }

        if (sortColumn !== null) {
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let oss = await conn.query(queryString, queryParams);

        return oss.map(
            os => new Os(os.name, os.serial)
        );
    }

    //Gets number of OS, filters can be applied
    static async getCount(conn, filterColumns = [], filterValues = [], filterOperator = []) {
        let queryString = `SELECT COUNT(os_serial) AS count FROM os`
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

        let oss = await conn.query(queryString, queryParams);
        return oss[0].count;
    }

    //Add new OS to database
    static async add(conn, serial, name) {
        let queryString = `INSERT INTO os (os_serial, name)
                           VALUES (?, ?)`;
        await conn.query(queryString, [serial, name]);
    }

    //Attach a OS to existing ticket
    static async addToTicket(conn, serial, ticket_id) {
        let queryString = `INSERT INTO ticket_os (os_serial, ticket_id)
                           VALUES (?, ?)`;
        await conn.query(queryString, [serial, ticket_id]);
    }

    //Detach a OS from an existing ticket
    static async deleteFromTicket(conn, serial, ticket_id) {
        let queryString = `DELETE
                           FROM ticket_os
                           WHERE ticket_id = ?
                             AND os_serial = ?`;
        await conn.query(queryString, [ticket_id, serial]);
    }

    //Allows an existing OS's values to be changed
    static async update(conn, serial, newSerial = null, name = null) {
        let queryString = `UPDATE os \n SET`;
        let queryParams = []

        if (newSerial !== null) {
            queryString += ` os_serial = ?`;
            queryParams.push(newSerial)
        }

        if (name !== null) {
            if (queryParams.length !== 0)
                queryString += `,`;
            queryString += ` name = ?`;
            queryParams.push(name)
        }
        queryString += `\n WHERE os_serial = ?`;
        queryParams.push(serial)

        await conn.query(queryString, queryParams)
    }


}

module.exports = Os
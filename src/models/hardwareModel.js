//The Hardware model stores information about hardware in the company
class Hardware {
    constructor(name, serial) {
        this.name = name
        this.serial = serial
    }

    //Retrieves all hardware
    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null) {

        let queryString = "SELECT hardware_serial AS serial, name FROM hardware";
        let queryParams = [];

        if (search !== null) {
            queryString += `\n WHERE name LIKE '%?%' \n OR hardware_serial LIKE '%?%'`;
            queryParams.push(search, search)
        }

        if (sortColumn !== null) {
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let hardwares = await conn.query(queryString, queryParams);

        return hardwares.map(
            hardware => new Hardware(hardware.name, hardware.serial)
        );


    }

    //Gets number of hardware, filters can be applied
    static async getCount(conn, filterColumns = [], filterValues = [], filterOperator = []) {
        let queryString = `SELECT COUNT(hardware_serial) AS count FROM hardware`
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

        let hardwares = await conn.query(queryString, queryParams);
        return hardwares[0].count;
    }

    //Add new hardware to database
    static async add(conn, serial, name) {
        let queryString = `INSERT INTO hardware (hardware_serial, name)
                           VALUES (?, ?)`;
        await conn.query(queryString, [serial, name]);

    }

    //Attach a hardware to existing ticket
    static async addToTicket(conn, serial, ticket_id) {
        let queryString = `INSERT INTO ticket_hardware (hardware_serial, ticket_id)
                           VALUES (?, ?)`;
        await conn.query(queryString, [serial, ticket_id]);
    }

    //Detach a hardware from an existing tickert
    static async deleteFromTicket(conn, serial, ticket_id) {
        let queryString = `DELETE
                           FROM ticket_hardware
                           WHERE ticket_id = ?
                             AND hardware_serial = ?`;
        await conn.query(queryString, [ticket_id, serial]);
    }

    //Allows an existing hardware's values to be changed
    static async update(conn, serial, newSerial = null, name = null) {
        let queryString = `UPDATE hardware \n SET`;
        let queryParams = []

        if (newSerial !== null) {
            queryString += ` hardware_serial = ?`;
            queryParams.push(newSerial)
        }

        if (name !== null) {
            if (queryParams.length !== 0)
                queryString += `,`;
            queryString += ` name = ?`;
            queryParams.push(name)
        }

        queryString += `\n WHERE hardware_serial = ?`;
        queryParams.push(serial)

        await conn.query(queryString, queryParams)

    }

}

module.exports = Hardware;


//The Software model stores information about software in the company
class Software {
    constructor(name, serial) {
        this.name = name
        this.serial = serial
    }

    //Retrieves all software
    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null) {

        let queryString = "SELECT software_serial AS serial, name FROM software";
        let queryParams = [];

        if (search !== null) {
            queryString += `\n WHERE name LIKE '%?%' \n OR software_serial LIKE '%?%'`;
            queryParams.push(search, search)
        }

        if (sortColumn !== null) {
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let softwares = await conn.query(queryString, queryParams);

        return softwares.map(
            software => new Software(software.name, software.serial)
        );
    }

    //Gets number of software, filters can be applied
    static async getCount(conn, filterColumns = [], filterValues = [], filterOperator = []) {
        let queryString = `SELECT COUNT(software_serial) AS count FROM software`
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

        let softwares = await conn.query(queryString, queryParams);
        return softwares[0].count;
    }

    //Add new software to database
    static async add(conn, serial, name) {
        let queryString = `INSERT INTO software (software_serial, name)
                           VALUES (?, ?)`;
        await conn.query(queryString, [serial, name]);
    }

    //Attach a software to existing ticket
    static async addToTicket(conn, serial, ticket_id) {
        let queryString = `INSERT INTO ticket_software (software_serial, ticket_id)
                           VALUES (?, ?)`;
        await conn.query(queryString, [serial, ticket_id]);
    }

    //Detach a software from an existing ticket
    static async deleteFromTicket(conn, serial, ticket_id) {
        let queryString = `DELETE
                           FROM ticket_software
                           WHERE ticket_id = ?
                             AND software_serial = ?`;
        await conn.query(queryString, [ticket_id, serial]);
    }

    //Allows an existing software's values to be changed
    static async update(conn, serial, newSerial = null, name = null) {
        let queryString = `UPDATE hardware \n SET`;
        let queryParams = []

        if (newSerial !== null) {
            queryString += ` software_serial = ?`;
            queryParams.push(newSerial)
        }

        if (name !== null) {
            if (queryParams.length !== 0)
                queryString += `,`;
            queryString += ` name = ?`;
            queryParams.push(name)
        }

        queryString += `\n WHERE software_serial = ?`;
        queryParams.push(serial)

        await conn.query(queryString, queryParams)
    }

}

module.exports = Software
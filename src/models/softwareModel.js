class Software{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }

    static async getAll(conn, skip, limit, filterColumn = null, filterValue = null, sortColumn = null, sortType = null){

        let queryString = "SELECT software_serial as serial, name FROM software";
        let queryParams = [];
        
        if(filterColumn !== null){
            queryString += `\n WHERE ? = ?`;
            queryParams.push(filterColumn, filterValue)
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
}

module.exports = Software
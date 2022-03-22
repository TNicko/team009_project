class Software{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }

    static async getAll(conn, skip, limit, search = null, sortColumn = null, sortType = null){

        let queryString = "SELECT software_serial as serial, name FROM software";
        let queryParams = [];
        
        if(search !== null){
            queryString += `\n WHERE name = '%?%' \n OR software_serial = '%?%'`;
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
}

module.exports = Software
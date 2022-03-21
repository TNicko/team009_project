class Os{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }

    static async getAll(conn, skip, limit,  searchColumn = null, search = null, sortColumn = null, sortType = null){

        let queryString = "SELECT os_serial as serial, name FROM os";
        let queryParams = [];
        
        if(search !== null){
            queryString += `\n WHERE ? = ?`;
            queryParams.push(searchColumn, search)
        }

        if(sortColumn !== null){
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;
        }

        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        let oss = await conn.query(queryString, queryParams);

        return oss.map(
            os => new Software(os.name, os.serial)
        );
    }
}

module.exports = Os
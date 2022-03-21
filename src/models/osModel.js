class Os{
    constructor(name, serial){
        this.name = name
        this.serial = serial
    }

    static async getAll(conn, skip, limit, filterColumn = null, filterValue = null, sortColumn = null, sortType = null){

        let queryString = "SELECT os_serial as serial, name FROM os";
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

        let oss = await conn.query(queryString, queryParams);

        return oss.map(
            os => new Software(os.name, os.serial)
        );
    }
}

module.exports = Os
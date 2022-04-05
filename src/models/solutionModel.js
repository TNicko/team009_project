class Solution {
    constructor(solutionId, ticketId, dateTime, solutionStatus, handlerId, solution) {
        this.solutionId = solutionId;
        this.ticketId = ticketId;
        this.dateTime = dateTime;
        this.solutionStatus = solutionStatus;
        this.handlerId = handlerId;
        this.solution = solution;
    }

    static async getAllForTicketId(conn, id) {
        let queryString =
            "SELECT solution_id AS id, datetime AS dateTime, solution_status AS status, handler_id AS handlerId, solution FROM solution WHERE ticket_id = ? ORDER BY datetime DESC";
        let queryParams = [id];

        let results = await conn.query(queryString, queryParams);

        return results.map(
            row => new Solution(row.id, id, row.dateTime, row.status, row.handlerId, row.solution)
        );
    }

    static async createForTicket(conn, ticketId, status, handlerId, solution){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds;
        var dateTime = date+' '+time;

        let queryString =
            "INSERT INTO solution VALUES (?, ?, ?, ?, ?)";
        let queryParams = [ticketId, dateTime, status, handlerId, solution];

        await conn.query(queryString, queryParams);
    }

    static async updateById(conn, solutionId, ticketId = null, status = null, handlerId = null, solution = null){
        const allParams = {'ticket_id': ticketId, 'solution_status': status, 'handler_id' : handlerId, 'solution' : solution};
        let queryString = "";
        let queryParams = [];

        const addToQuery = (param, name) => {
            if(param != null){
                queryString += `,${name} = ? `;
                queryParams.push(param);
            }
        }

        for (const [name, param] of Object.entries(allParams)) {
            if(param != null && !queryParams.length){
                queryString += `UPDATE solution SET ${name} = ?`;
                queryParams.push(param);
            }else{
                addToQuery(param,name);
            }
        }

        if(queryParams.length){
            queryString += "WHERE solution_id = ?";
            queryParams.push(solutionId)
            await conn.query(queryString, queryParams);
        }
    }
}
module.exports = Solution;
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

    static async createForTicket(conn){
        // Take values from created object?
        let queryString =
            "INSERT INTO solution VALUES (?, ?, ?, ?, ?)";
        let queryParams = [id, this.dateTime, this.solutionStatus, this.handlerId, this.solution];

        let result = await conn.query(queryString, queryParams);
        
    }

    static async updateById(conn, solutionId, ticketId, status, handlerId, solution){
        let queryString = "UPDATE solution SET ticket_id = ?, solution_status = ?, handler_id = ?, solution = ? WHERE solution_id = ?"
        let queryParams = [ticketId, status, handlerId, solution, solutionId]
        let result = await conn.query(queryString, queryParams);
    }
}
module.exports = Solution;
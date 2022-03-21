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
}
module.exports = Solution;
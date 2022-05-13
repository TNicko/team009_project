// The solution model contains information about prior solutions that has been archived in the system
class Solution {
    constructor(solutionId, ticketId, dateTime, solutionStatus, handlerId, solution) {
        this.solutionId = solutionId;
        this.ticketId = ticketId;
        this.dateTime = dateTime;
        this.solutionStatus = solutionStatus;
        this.handlerId = handlerId;
        this.solution = solution;
    }

    // This is a function to get all the solutions available where those solutions were successful
    static async getAllSuccessSolution(conn, search = null, problemType = null) {
        let queryString =
            `SELECT solution.solution_id AS id,
                    solution.datetime    AS dateTime,
                    solution.solution    AS solution,
                    ticket.description   AS description,
                    expertise.name
             FROM ticket_expertise
                  INNER JOIN expertise ON ticket_expertise.expertise_id = expertise.expertise_id
                  LEFT JOIN ticket ON ticket_expertise.ticket_id = ticket.ticket_id
                  LEFT JOIN solution ON solution.ticket_id = ticket.ticket_id
             WHERE solution.solution_status = 'successful'
               AND ticket.description LIKE ?
               AND expertise.name LIKE ?
             ORDER BY dateTime DESC`;

        let queryParams = [];
        if (search === null) queryParams.push('%');
        else queryParams.push(`%${search}%`);
        if (problemType === null) queryParams.push('%');
        else queryParams.push(`%${problemType}%`);


        let results = await conn.query(queryString, queryParams);
        return results;
    }

    // Gets the solution for a certain ticket
    static async getAllForTicketId(conn, id) {
        let queryString =
            `SELECT solution_id     AS id,
                    datetime        AS dateTime,
                    solution_status AS status,
                    handler_id      AS handlerid,
                    solution
             FROM solution
             WHERE ticket_id = ?
             ORDER BY dateTime DESC`;
        let queryParams = [id];

        let results = await conn.query(queryString, queryParams);

        return results.map(
            row => new Solution(row.id, id, row.dateTime, row.status, row.handlerId, row.solution)
        );
    }

    // This functions allows for creating a solution for a ticket
    static async createForTicket(conn, ticketId, status, handlerId, solution) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let queryString =
            "INSERT INTO solution (ticket_id, datetime, solution_status, handler_id, solution) VALUES (?, ?, ?, ?, ?)";
        let queryParams = [ticketId, dateTime, status, handlerId, solution];

        await conn.query(queryString, queryParams);
    }

    // Function that allows for updating a specified solution by ID
    static async updateById(conn, solutionId, ticketId = null, status = null, handlerId = null, solution = null) {
        const allParams = {
            'ticket_id': ticketId,
            'solution_status': status,
            'handler_id': handlerId,
            'solution': solution
        };
        let queryString = "";
        let queryParams = [];

        const addToQuery = (param, name) => {
            if (param != null) {
                queryString += `,${name} =
            ? `;
                queryParams.push(param);
            }
        }

        for (const [name, param] of Object.entries(allParams)) {
            if (param != null && !queryParams.length) {
                queryString += `UPDATE
                                    solution
                                SET ${name} = ? `;
                queryParams.push(param);
            } else {
                addToQuery(param, name);
            }
        }

        if (queryParams.length) {
            queryString += "WHERE solution_id = ?";
            queryParams.push(solutionId)
            await conn.query(queryString, queryParams);
        }
    }
}

module.exports = Solution;
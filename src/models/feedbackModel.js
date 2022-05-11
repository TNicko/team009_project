//The Feedback Model contains information about a user's response to a solution
class Feedback {
    constructor(feedbackId, ticketId, dateTime, feedback, userId) {
        this.feedbackId = feedbackId;
        this.ticketId = ticketId;
        this.dateTime = dateTime;
        this.feedback = feedback;
        this.userId = userId;
    }
    
    //This retrieves all feedback from a ticket
    static async getAllForTicketId(conn, id) {
        let queryString =
            "SELECT feedback_id AS id, datetime AS dateTime, feedback, user_id AS userId FROM feedback WHERE ticket_id = ? ORDER BY datetime DESC";
        let queryParams = [id];

        let results = await conn.query(queryString, queryParams);

        return results.map(
            row => new Feedback(row.id, id, row.dateTime, row.feedback, row.userId)
        );
    }

    //This function creates and attaches a feedback to an existing ticket 
    static async createForTicket(conn, ticketId, feedback, userId) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds;
        var dateTime = date + ' ' + time;

        let queryString =
            "INSERT INTO feedback (ticket_id, datetime, feedback, user_id) VALUES (?, ?, ?, ?)";
        let queryParams = [ticketId, dateTime, feedback, userId];

        await conn.query(queryString, queryParams);
    }

    //Allows an existing feedback's values to be changed, requires feedback id
    static async updateById(conn, feedbackId, ticketId = null, feedback = null, userId = null) {
        const allParams = {'ticket_id': ticketId, 'feedback': feedback, 'user_id': userId};
        let queryString = "";
        let queryParams = [];

        const addToQuery = (param, name) => {
            if (param != null) {
                queryString += `,${name} = ? `;
                queryParams.push(param);
            }
        }

        for (const [name, param] of Object.entries(allParams)) {
            if (param != null && !queryParams.length) {
                queryString += `UPDATE feedback
                                SET ${name} = ?`;
                queryParams.push(param);
            } else {
                addToQuery(param, name);
            }
        }

        if (queryParams.length) {
            queryString += "WHERE feedback_id = ?";
            queryParams.push(feedbackId)
            await conn.query(queryString, queryParams);
        }
    }
}

module.exports = Feedback;
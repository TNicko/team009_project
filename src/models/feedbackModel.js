class Feedback {
    constructor(feedbackId, ticketId, dateTime, feedback, userId) {
        this.feedbackId = feedbackId;
        this.ticketId = ticketId;
        this.dateTime = dateTime;
        this.feedback = feedback;
        this.userId = userId;
    }

    static async getAllForTicketId(conn, id) {
        let queryString =
            "SELECT feedback_id AS id, datetime AS dateTime, feedback, user_id AS userId FROM feedback WHERE ticket_id = ? ORDER BY datetime DESC";
        let queryParams = [id];

        let results = await conn.query(queryString, queryParams);

        return results.map(
            row => new Feedback(row.id, id, row.dateTime, row.feedback, row.userId)
        );
    }
}
module.exports = Feedback;
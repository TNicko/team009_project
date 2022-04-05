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

    static async createForTicket(conn, id, feedback, userId){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds;
        var dateTime = date+' '+time;

        let queryString =
            "INSERT INTO feedback VALUES (?, ?, ?, ?)";
        let queryParams = [id, dateTime, feedback, userId];

        let result = await conn.query(queryString, queryParams);
    }

    static async updateById(conn, feedbackId, ticketId = null, feedback = null, userId = null){
        // const object = {'ticket_id': ticketId, 'b': 2, 'c' : 3};
        // for (const [key, value] of Object.entries(object)) {
        // console.log(key, value);}

        let params = [ticketId, feedback, userId];
        let paramNames = ['ticket_id', 'feedback', 'user_id']
        let queryString = "";
        let queryParams = [];

        const addToQuery = (param, name) => {
            if(param != null){
                queryString += `,${name} = ? `;
                queryParams.push(param);
            }
        }

        for(var i = 0; i < params.length; i++){
            if(params[i] != null && !queryParams.length){
                queryString += `UPDATE feedback SET ${paramNames[i]} = ?`;
                queryParams.push(params[i]);

            }else{
                addToQuery(params[i],paramNames[i]);
            }
        }

        if(queryParams.length){
            queryString += "WHERE feedback_id = ?";
            queryParams.push(feedbackId)
            await conn.query(queryString, queryParams);
        }
    }
}
module.exports = Feedback;
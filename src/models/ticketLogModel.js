//The TicketLog Model contains information about a past change to a ticket's value 
class TicketLog {
    constructor(logId, ticketId, updateDate, updateType, updateValue) {
        this.logId = logId;
        this.ticketId = ticketId;
        this.updateDate = updateDate;
        this.updateType = updateType;
        this.updateValue = updateValue;
    }

    //Retrieves all logs for a ticket
    static async getAllForTicketId(conn, id) {
        let queryString =
            "SELECT log_id AS id, update_date AS date, update_type AS type, update_value AS value FROM ticket_log WHERE ticket_id = ? ORDER BY update_date DESC";
        let queryParams = [id];

        let logs = await conn.query(queryString, queryParams);

        return logs.map(
            log => new TicketLog(log.id, id, log.date, log.type, log.value)
        );
    }

    //Creates and attaches a log to an existing ticket
    static async createForTicket(conn, id, type, value) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        let queryString = `
            INSERT INTO ticket_log (ticket_id, update_date, update_type, update_value)
            VALUES (?, ?, ?, ?)
        `;
        let queryParams = [id, dateTime, type, value];

        await conn.query(queryString, queryParams);
    }
}

module.exports = TicketLog;

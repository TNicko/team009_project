class TicketLog {
    constructor(logId, ticketId, updateDate, updateType, updateValue) {
        this.logId = logId;
        this.ticketId = ticketId;
        this.updateDate = updateDate;
        this.updateType = updateType;
        this.updateValue = updateValue;
    }

    static async getAllForTicketId(conn, id) {
        let queryString =
            "SELECT log_id AS id, update_date AS date, update_type AS type, update_value AS value FROM ticket_log WHERE ticket_id = ? ORDER BY update_date DESC";
        let queryParams = [id];

        let logs = await conn.query(queryString, queryParams);

        return logs.map(
            log => new TicketLog(log.id, id, log.date, log.type, log.value)
        );
    }
}
module.exports = TicketLog;

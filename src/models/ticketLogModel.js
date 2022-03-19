class TicketLog {
    constructor(log_id, ticket_id, update_date, update_type, update_value) {
        this.log_id = log_id;
        this.ticket_id = ticket_id;
        this.update_date = update_date;
        this.update_type = update_type;
        this.update_value = update_value;
    }

    static async getAllForTicketId(conn, id) {
        let queryString =
            "SELECT log_id AS id, update_date AS date, update_type AS type, update_value AS value FROM ticket_log WHERE ticket_id = ? ORDER BY update_date DESC";
        let queryParams = [id];

        let logs = await conn.query(queryString, queryParams);

        return logs.map(
            log => new TicketLog(log.id, log.date, log.type, log.value)
        );
    }
}
module.exports = TicketLog;

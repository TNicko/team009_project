class Ticket {
    // Specialist Ticket Table
    constructor(ticket_id, status, employee_id, handler_id, description, notes) {
        this.ticket_id = ticket_id;
        this.status = status;
        this.employee_id = employee_id;
        this.handler_id = handler_id;
        this.description = description;
        this.notes = notes;
        // Add all other ticket info ...
    }



    static async getAll(conn) {
        let rows = await conn.query(
            "SELECT ticket_id, status, employee_id, handler_id, description, notes FROM ticket",
        );
        // return rows.map(
        //     ticket => new Ticket()
        // );
    }
}
module.exports = Ticket;
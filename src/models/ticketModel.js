const exp = require("constants");

class Ticket {
    // Specialist Ticket Table
    constructor(ticket_id, status, employee_id, handler_id, description, notes, last_updated, problem_type) {
        this.ticket_id = ticket_id;
        this.status = status;
        this.employee_id = employee_id;
        this.handler_id = handler_id;
        this.description = description;
        this.notes = notes;

        this.problem_type;
        this.last_updated; // !!! get last updated !!!
        // Add all other ticket info ...
    }



    static async getAll(conn) {
        let rows = await conn.query(
            `SELECT ticket.*, problem_type FROM ticket INNER JOIN
            (SELECT ticket_id, GROUP_CONCAT(exp_name) AS problem_type
            FROM (SELECT ticket_id, exp.name AS exp_name FROM ticket_expertise INNER JOIN expertise AS exp ON ticket_expertise.expertise_id = exp.expertise_id) AS exp
            GROUP BY ticket_id) AS exp ON ticket.ticket_id = exp.ticket_id`,
        );
        return rows.map(
            ticket => new Ticket(ticket.ticket_id, ticket.status, ticket.employee_id, ticket.handler_id, 
                ticket.description, ticket.notes, ticket.problem_type)
        );
    }
}
module.exports = Ticket;
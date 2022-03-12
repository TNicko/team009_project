class Employee {
    constructor(id, name, job, department, telephone) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.department = department;
        this.telephone = telephone;
    }

    static async getAll(conn) {
        let rows = await conn.query(
            "SELECT employee_id AS id, name, job, department, telephone FROM employee",
        );
        return rows.map(
            emp => new Employee(emp.id, emp.name, emp.job, emp.department, emp.telephone)
        );
    }
}
module.exports = Employee;
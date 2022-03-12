class Employee {
    constructor(id, name, job, department, telephone) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.department = department;
        this.telephone = telephone;
    }

    static getAll(conn, callback) {
        conn.query(
            "SELECT employee_id AS id, name, job, department, telephone FROM employee",
            (error, results) => {
                if (error) throw error;
                let ret = results.map(emp => {
                    return new Employee(emp.id, emp.name, emp.job, emp.department, emp.telephone);
                });
                callback(ret);
            }
        );
    }
}
module.exports = Employee;
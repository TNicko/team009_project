class User {
    constructor(id, name, job, department, telephone) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.department = department;
        this.telephone = telephone;
    }

    static async getAll(conn) {
        let rows = await conn.query(
            "SELECT user_id AS id, name, job, department, telephone FROM user",
        );
        return rows.map(
            emp => new User(emp.id, emp.name, emp.job, emp.department, emp.telephone)
        );
    }
}
module.exports = User;
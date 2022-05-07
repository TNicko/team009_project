class Account {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }


    static async getByName(conn, name) {

        let accountResult = await conn.query(
            `SELECT user_id AS id, username, password
             FROM account
             WHERE username = ?`,
            [name]
        );

        let account = accountResult[0];

        if (account) {
            return new Account(
                account.id,
                account.username,
                account.password,
            );
        } else {
            return null;
        }

    }

    static async getById(conn, id) {

        let accountResult = await conn.query(
            `SELECT user_id AS id, username, password
             FROM account
             WHERE user_id = ?`,
            [id]
        );

        let account = accountResult[0];

        if (account) {
            return new Account(
                account.id,
                account.username,
                account.password,
            );
        } else {
            return null;
        }

    }

    static async updatePasswordById(conn, userId, password) {
        let queryString = "UPDATE account SET password = ? WHERE user_id = ?";
        let queryParams = [password, userId];
        await conn.query(queryString, queryParams);
    }
}

module.exports = Account;
class Account {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }


    static async getByName(conn, name) {
            let accountResult = await conn.query(
                `SELECT user_id AS id,username,password FROM account
                 FROM account
                 WHERE username = ?`,
                [name]
            );
    
            let account = accountResult[0];
    
            return new Account(
                account.id,
                account.username,
                account.password,
            );
        }
}

module.exports = Account;
// The User model contains information about someone using the system.
// This could be a user, an admin, a specialist, an analyst, or an external specialist.
class User {
    constructor(id, name, job, department, telephone, type) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.department = department;
        this.telephone = telephone;
        this.type = type;
    }

    // Get all the users in the system, with the given filters and sort order.
    // The skip and limit parameters are for pagination.
    // conn is the object that has the query() function for executing the SQL query.
    static async getAll(conn, skip, limit, filterColumn = null, filterValue = null, sortColumn = null, sortType = null) {
        // We have a base query string. We're going to add extra things to this query string
        // and build it up, depending on what's given in the parameters.
        // We also have queryParams, which is the data that actually needs to be passed into
        // the SQL query.
        let queryString = "SELECT user_id AS id, name, job, department, telephone, account_type AS type FROM user";
        let queryParams = [];

        // If filterColumn is not null, it means that the SQL query needs to filter the results.
        if (filterColumn !== null) {
            if (filterValue !== null) {
                queryString += `\n WHERE ${filterColumn} = ?`;
                queryParams.push(filterValue);
            } else {
                queryString += `\n WHERE ${filterColumn} IS NULL`;
            }
        }

        // If sortColumn is not null, it means that the SQL query needs to sort the results.
        if (sortColumn !== null)
            // We're not allowed to use question marks for an ORDER BY, so we have to put the
            // sortColumn and sortType directly into the string.
            queryString += `\n ORDER BY ${sortColumn} ${sortType}`;

        // Finally, we have the pagination which is done by the LIMIT command.
        // E.g. "LIMIT 100, 50" means skip the first 100 results and get the next 50.
        // We can use this to paginate our results because we can ask for the first
        // 20 results, then for the next page we skip the first 20 and ask the next 20,
        // etc.
        // Notice that we don't check if skip or limit are null before doing the query.
        // This is because pagination should be forced.
        queryString += `\n LIMIT ?, ?`;
        queryParams.push(skip, limit);

        // Now that we've built our query string and made the query parameters, we're
        // ready to actually execute the query.
        let users = await conn.query(queryString, queryParams);

        // After we've gotten our rows, we need to convert them into the actual Users.
        return users.map(
            user => new User(user.id, user.name, user.job, user.department, user.telephone, user.type)
        );
    }

    // Get the user with the given ID.
    static async getById(conn, id) {

        let query = 'SELECT user_id AS id, name, job, department, telephone, account_type AS type FROM user WHERE user_id = ?';
        let params = [id];
        let result = await conn.query(query, params);
        let user = result[0];

        return new User(
            user.id,
            user.name,
            user.job,
            user.department,
            user.telephone,
            user.type
        );
    }

    // Create a new user in the system.
    static async create(conn, name, job, department, telephone, type) {
        let queryString = `
            INSERT INTO user (name, job, department, telephone, account_type)
            VALUES (?, ?, ?, ?, ?)
        `;
        let queryParams = [name, job, department, telephone, type];

        let result = await conn.query(queryString, queryParams);
        return result.insertId;
    }
}

module.exports = User;
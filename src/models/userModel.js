class User {
    constructor(id, name, job, department, telephone) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.department = department;
        this.telephone = telephone;
    }

    // This is an example function so that you can understand what models are
    // supposed to do in an MVC architecture.
    // I'm going to heavily comment this example function so that you can understand
    // what's going on, but in your actual code don't comment such obvious things.
    // For your model if you don't need the extra features like filter and sort,
    // just ignore the code here that tackles that.
    // Note: the skip and limit parameters are for pagination.
    // conn is the object that has the query() function for executing the SQL query.
    static async getAll(conn, skip, limit, filterColumn = null, filterValue = null, sortColumn = null, sortType = null) {
        // We have a base query string. We're going to add extra things to this query string
        // and build it up, depending on what's given in the parameters.
        // We also have queryParams, which is the data that actually needs to be passed into
        // the SQL query.
        let queryString = "SELECT user_id AS id, name, job, department, telephone FROM user";
        let queryParams = [];

        // If filterColumn is not null, it means that the SQL query needs to filter the results.
        // This is done with a WHERE
        if (filterColumn !== null) {
            // Notice that we have 2 question marks. Instead of putting the filterColumn and
            // filterValue directly in the query string, we put them in queryParams.
            // The MySQL module will automatically substitute in our actual data from
            // queryParams into the question marks whenever the SQL query is run.
            // The \n just means new line.
            queryString += `\n WHERE ? = ?`;
            queryParams.push(filterColumn, filterValue);
        }

        // If sortColumn is not null, it means that the SQL query needs to sort the results.
        // This is done with a ORDER BY
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
        // Calling conn.query will give us an array of all the rows given by the query.
        // You don't need to understand what await does here, but make sure to write
        // await before calling any function marked as async.
        let users = await conn.query(queryString, queryParams);

        // After we've gotten our rows, we need to convert them into the actual User
        // object. Here I've used a map to convert each element of the users array into
        // a User object, but you can use a normal for loop if ur cringe.
        return users.map(
            user => new User(user.id, user.name, user.job, user.department, user.telephone)
        );

        // reminder to not write this many obvious comments for your actual code unless you
        // want to get beaten up by me
    }
}

module.exports = User;
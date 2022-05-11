const mysql = require('mysql');
const util = require('util');

// On sci-project, the MySQL database is located at mysql://localhost
// On our containerised Docker app, it is located at mysql://mysql
// We add an environment variable from the Docker Compose configuration
// called DOCKER so that we can use the appropriate host
const host = process.env.DOCKER ? "mysql" : "localhost";
const conn = mysql.createConnection({
    host: host,
    user: 'teamb009',
    password: '6TfmSlNpBt',
    database: 'teamb009',
});

conn.connect(function (error) {
    if (error) {
        console.log('Error:');
        console.error(error);
    } else {
        console.log('Database connected!');
    }
});

// The mysql module doesn't support promises out of the box which means much
// of the architecture would become prone to callback-hell. We use the native
// util.promisify so that it's generally easier to work with the mysql client.
const query = util.promisify(conn.query).bind(conn);
module.exports = {query: query};


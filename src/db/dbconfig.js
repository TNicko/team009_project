const mysql = require('mysql');

// On sci-project, the MySQL database is located at mysql://localhost
// On our containerised Docker app, it is located at mysql://mysql
// We add an environment variable from the Docker Compose configuration
// called DOCKER so that we can use the appropriate host
const host = process.env.DOCKER ? "mysql" : "localhost";
const dbConn = mysql.createConnection({
    host: host,
    user: 'teamb009',
    password: '6TfmSlNpBt',
    database: 'teamb009',
});

// TODO: Timeout and retry on failure instead of giving up instantly
dbConn.connect(function(error) {
    if (error) {
        console.log('Error:');
        console.error(error);
    } else {
        console.log('Database connected!');
    }
});

module.exports = dbConn;
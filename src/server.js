const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

// --- sci project connection ---
const mysql = require('mysql')
// On sci-project, the MySQL database is located at mysql://localhost
// On our containerised Docker app, it is located at mysql://mysql
// We add an environment variable from the Docker Compose configuration
// called DOCKER so that we can use the appropriate host
const host = process.env.DOCKER ? "mysql" : "localhost"
const dbConn = mysql.createConnection({
    host: host,
    user: 'teamb009',
    password: '6TfmSlNpBt',
    database: 'teamb009',
})

dbConn.connect(function(error) {
    if (error) {
        console.log('error:')
        console.error(error)
    } else {
        console.log('Database connected!')
    }
})
// -------------------------------

app.use('/', indexRouter)

var port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
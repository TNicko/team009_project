const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mysql = require('mysql')
const dbConn = mysql.createConnection({
    host: 'localhost',
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

app.use('/', indexRouter)

var port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
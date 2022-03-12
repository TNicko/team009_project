const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

const index = require('./controllers/indexController');
const employee = require('./controllers/employeeController');
app.use('/', index);
app.use('/employee', employee);


var port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
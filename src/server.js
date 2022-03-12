const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);

const index = require('./controllers/indexController');
const employee = require('./controllers/employeeController');
app.use('/', index);
app.use('/employee', employee);


var port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.use(expressLayouts);

const index = require('./controllers/indexController');
const user = require('./controllers/userController');
const login = require('./controllers/loginController');
app.use('/', index);
app.use('/user', user);
app.use('/login', login);


var port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// LOGIN AND AUTHENTICATION -----
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config')
initializePassport(passport, 
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

// dummy data -----
var users = []
const hashPass = async () => {
   const hashedPassword = await bcrypt.hash('password', 10);
   users.push({
    id: '1', 
    name:'Nicko', 
    username:'Nicko', 
    password: hashedPassword   
   }) 
}
hashPass()

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);

const index = require('./controllers/indexController');
const employee = require('./controllers/employeeController');
const login = require('./controllers/loginController');
app.use('/', index);
app.use('/employee', employee);
app.use('/login', login);


var port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
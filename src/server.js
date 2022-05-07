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

// ----------------- Login Config ------------------

const conn = require("./db/dbconfig.js");
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const Account = require('./models/accountModel');

// dummy data -----
// var password_names = ['specialist', 
// 'specialist', 'specialist', 'ex_specialist', 
// 'ex_specialist', 'analyst', 'analyst', 'analyst',
// 'user', 'user', 'user', 'user', 'user', 'user', 'user']
// var hPasswords = []
// const hashPass = async () => {

//     for (const password in password_names) {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         hPasswords.push({
//             password: password_names[password], 
//             hPassword: hashedPassword   
//         }) 
//     }
//     console.log(hPasswords);
// }
// hashPass()


const initializePassport = require('./passport-config')
// initializePassport(passport, 
//     username => accounts.find(user => user.username === username),
//     id => accounts.find(user => user.id === id)
// )

initializePassport(passport)

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

// ------------------------------------

const index = require('./controllers/indexController');
app.use('/', index);

var port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
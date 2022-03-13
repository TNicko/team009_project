// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
// const passport = require('passport');
// const flash = require('express-flash');
// const session = require('express-session');

// const initializePassport = require('./passport-config')
// initializePassport(passport, 
//     username => users.find(user => user.username === username),
//     id => users.find(user => user.id === id)
// )

// dummy data -----
// var users = []
// const hashPass = async () => {
//    const hashedPassword = await bcrypt.hash('password', 10);
//    users.push({
//     id: '1', 
//     name:'Nicko', 
//     username:'Nicko', 
//     password: hashedPassword   
//    }) 
// }
// hashPass()
// ---------------------

// router.use(express.urlencoded({ extended: false }))
// router.use(flash())
// router.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

// router.use(passport.initialize())
// router.use(passport.session())

router.get('/', (req, res) => {
    res.render('login');
})

// router.post('/', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }))


module.exports = router;

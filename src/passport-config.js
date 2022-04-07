const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Account = require('./models/accountModel');
const conn = require("./db/dbconfig.js");


function initialize(passport) {

    const authenticateUser = async (username, password, done) => {
        
        let user  = await Account.getByName(conn, username)

        if (user == null) {
            return done(null, false, { message: 'No user with that username' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {

                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new localStrategy({ usernameField: 'username'}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        let user  = await Account.getById(conn, id)
        return done(null, user);
    
    })
}

module.exports = initialize
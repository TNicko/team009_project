const express = require('express');
const router = express.Router();
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const Hardware = require("../models/hardwareModel");

router.get('/', checkAuthenticated, async (req, res) => {
    let user = await User.getById(conn, req.user.id);

    if (user.type === 'admin') {
        res.render('./index/admin', {username: req.user.username});
    }
    if (user.type === 'user') {
        res.render('./index/user', {username: req.user.username});
    }
    if (user.type === 'specialist') {
        res.render('./index/specialist', {username: req.user.username});
    }
    if (user.type === 'analyst') {
        res.render('./index/analyst', {username: req.user.username});
    }
})

// INDEX PAGES
router.get('/admin', async (req, res) => {
    res.render('./index/admin', {username: req.user.username});
})
router.get('/analyst', async (req, res) => {
    res.render('./index/analyst', {username: req.user.username});
})
router.get('/specialist', async (req, res) => {
    res.render('./index/specialist', {username: req.user.username});
})
router.get('/ext_specialist', async (req, res) => {
    res.render('./index/ext_specialist', {username: req.user.username});
})
router.get('/user', async (req, res) => {
    res.render('./index/user', {username: req.user});
})

// Tables
router.get('/hardware', async (req, res) => {
    let hardwares = await Hardware.getAll(conn, 0, 100);
    res.render('./tables/hardware', {username: req.user.username, hardwares: hardwares});
})
router.get('/software', async (req, res) => {
    res.render('./tables/software', {username: req.user.username});
})
router.get('/os', async (req, res) => {
    res.render('./tables/os', {username: req.user.username});
})

// Other
router.get('/ticket-information', async (req, res) => {
    res.render('./ticket-information', {username: req.user.username});
})
router.get('/account', async (req, res) => {
    res.render('./account', {username: req.user.username});
})
router.get('/submit_problem', async (req, res) => {
    res.render('./submit_problem', {username: req.user.username});
})
router.get('/all_tickets', async (req, res) => {
    res.render('./submit_problem', {username: req.user.username});
})
router.get('/users', async (req, res) => {
    res.render('./users', {username: req.user.username});
})

// Redirects to login if not authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

// Redirects to homepage if user authenticated
function checkNoAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    next()
}

module.exports = router;
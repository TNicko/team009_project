const express = require('express');
const router = express.Router();
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");

router.get('/', async (req, res) => {
    let result = await Ticket.getAll(conn, 0, 100);
    res.render('./index/specialist');
})

// INDEX PAGES
router.get('/admin', async (req, res) => {
    res.render('./index/admin');
})
router.get('/analyst', async (req, res) => {
    res.render('./index/analyst');
})
router.get('/ext_specialist', async (req, res) => {
    res.render('./index/ext_specialist');
})
router.get('/user', async (req, res) => {
    res.render('./index/user');
})

// Tables
router.get('/hardware', async (req, res) => {
    res.render('./tables/hardware');
})
router.get('/software', async (req, res) => {
    res.render('./tables/software');
})
router.get('/os', async (req, res) => {
    res.render('./tables/os');
})

// Other
router.get('/ticket-information', async (req, res) => {
    res.render('./ticket-information');
})
router.get('/account', async (req, res) => {
    res.render('./account');
})
router.get('/submit_problem', async (req, res) => {
    res.render('./submit_problem');
})



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}


function checkNoAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    next()
}
module.exports = router;
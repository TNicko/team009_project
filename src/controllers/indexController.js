const express = require('express');
const router = express.Router();
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");

router.get('/', async (req, res) => {
    let result = await Ticket.getAll(conn, 0, 100);
    res.render('./index/specialist');
})

router.get('/ticket-information', async (req, res) => {
    res.render('./ticket-information');
})
router.get('/tickets', async (req, res) => {
    res.render('./index/specialist');
})
router.get('/account', async (req, res) => {
    res.render('./account');
})
router.get('/tables', async (req, res) => {
    res.render('./tables');
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
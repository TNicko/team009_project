const express = require('express');
const router = express.Router();
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const Hardware = require("../models/hardwareModel");
const Account = require('../models/accountModel.js');
const TicketLog = require('../models/ticketLogModel.js');
const Solution = require('../models/solutionModel');
const Feedback = require('../models/feedbackModel');

router.get('/', checkAuthenticated, async (req, res) => {

    update_date = await getLastUpdatedDate(5);
    console.log(update_date);

    let user = await User.getById(conn, req.user.id);

    if (user.type === 'admin') {
        res.render('./index/admin', {username: req.user.username});
    }
    if (user.type === 'user') {
        res.render('./index/user', {username: req.user.username});
    }
    if (user.type === 'specialist') {
    
        let handlerId = 'handler_id';
        let spec_tickets = await Ticket.getAll(conn, 0, 25, handlerId, user.id);
        let open_tickets = await Ticket.getAll(conn, 0, 25, handlerId, null);

        res.render('./index/specialist', {
            username: req.user.username,
            spec_tickets: spec_tickets,
            open_tickets: open_tickets
        });
    }
    if (user.type === 'external specialist') {

        let handlerId = 'handler_id';
        let spec_tickets = await Ticket.getAll(conn, 0, 25, handlerId, user.id);

        res.render('./index/ext_specialist', {
            username: req.user.username,
            spec_tickets: spec_tickets
        });
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

// External Spec pages
router.get('/ext-account', async (req, res) => {

    let user = await User.getById(conn, req.user.id);
    console.log(user);
    res.render('./ext_spec/ext_account', {
        username: req.user.username,
        user: user
    });
})
router.get('/ext-ticket-information', async (req, res) => {
    res.render('./ext_spec/ext_ticket_info', {username: req.user.username});
})

// Get ticket last updated date
async function getLastUpdatedDate (ticketId) {
    let ticket_logs = await TicketLog.getAllForTicketId(conn, ticketId);
    let solutions = await Solution.getAllForTicketId(conn, ticketId);
    let feedbacks = await Feedback.getAllForTicketId(conn, ticketId);

    const arr = [];

    if (solutions[0] != null) {
        arr.push(solutions[0].dateTime);
    }
    if (feedbacks[0] != null) {
        arr.push(feedbacks[0].dateTime);
    }
    if (ticket_logs[0] != null) {
        arr.push(ticket_logs[0].updateDate);
    }

    if (arr.length != 0) {
        const max = new Date(Math.max(...arr));
        return max.toLocaleDateString();
    } else {
        // Get date created here 
        return "[creation date]";

    }

}

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
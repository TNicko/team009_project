const express = require('express');
const router = express.Router();
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");
const TicketLog = require("../models/ticketLogModel");
const Solution = require("../models/solutionModel");
const User = require("../models/userModel");
const Hardware = require("../models/hardwareModel");
const Account = require('../models/accountModel.js');
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
// router.get('/admin', async (req, res) => {
//     res.render('./index/admin', {username: req.user.username});
// })
// router.get('/analyst', async (req, res) => {
//     res.render('./index/analyst', {username: req.user.username});
// })
// router.get('/specialist', async (req, res) => {
//     res.render('./index/specialist', {username: req.user.username});
// })
// router.get('/ext_specialist', async (req, res) => {
//     res.render('./index/ext_specialist', {username: req.user.username});
// })
// router.get('/user', async (req, res) => {
//     res.render('./index/user', {username: req.user});
// })

// Tables
router.get('/hardware',checkAuthenticated, async (req, res) => {
    let hardwares = await Hardware.getAll(conn, 0, 100);
    res.render('./tables/hardware', {username: req.user.username, hardwares: hardwares});
})
router.get('/software',checkAuthenticated, async (req, res) => {
    res.render('./tables/software', {username: req.user.username});
})
router.get('/os',checkAuthenticated, async (req, res) => {
    res.render('./tables/os', {username: req.user.username});
})

// Other
router.get('/ticket/:id',checkAuthenticated, async (req, res) => {
    let ticketId = req.params.id;
    let ticket = await Ticket.getById(conn, ticketId);
    let user = await User.getById(conn, ticket.userId);
    let currentUser = await User.getById(conn, req.user.id);

    // Redirect user to home page if ticket is not theirs
    // TODO: Uncomment this when testing is finished
    // if (currentUserType === "user")
    //     if (user.id !== req.user.id)
    //         res.redirect('/');

    let logs = await TicketLog.getAllForTicketId(conn, ticketId);
    let solutions = await Solution.getAllForTicketId(conn, ticketId);
    let feedbacks = await Feedback.getAllForTicketId(conn, ticketId);
    let combined = combineSolutionsAndFeedbacks(solutions, feedbacks);

    let data = {
        username: req.user.username,
        currentUserType: currentUser.type,
        ticket: ticket,
        user: user,
        logs: logs,
        solutionsAndFeedbacks: combined
    };

    res.render('./ticket-information', data);
})
router.get('/account',checkAuthenticated, async (req, res) => {
    let user = await User.getById(conn, req.user.id);
    res.render('./account', {
        username: req.user.username,
        user: user
    });
})
router.get('/submit_problem',checkAuthenticated, async (req, res) => {
    res.render('./submit_problem', {username: req.user.username});
})
router.get('/all_tickets',checkAuthenticated, async (req, res) => {
    res.render('./submit_problem', {username: req.user.username});
})
router.get('/users',checkAuthenticated, async (req, res) => {
    res.render('./users', {username: req.user.username});
})

// Get ticket last updated date
async function getLastUpdatedDate(ticketId) {
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
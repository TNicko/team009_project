const express = require('express');
const router = express.Router();
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");
const TicketLog = require("../models/ticketLogModel");
const Solution = require("../models/solutionModel");
const Feedback = require("../models/feedbackModel");
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
router.get('/ticket/:id', async (req, res) => {
    let currentUserType = (await User.getById(conn, req.user.id)).type;
    let ticketId = req.params.id;
    let ticket = await Ticket.getById(conn, ticketId);
    let user = await User.getById(conn, ticket.userId);

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
        currentUserType: currentUserType,
        ticket: ticket,
        user: user,
        logs: logs,
        solutionsAndFeedbacks: combined
    };

    res.render('./ticket-information', data);
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

function combineSolutionsAndFeedbacks(solutions, feedbacks) {
    let solutionsAndFeedbacks = [];
    let solCounter = 0;
    let feedCounter = 0;
    while (solCounter < solutions.length || feedCounter < feedbacks.length) {
        if (solCounter === solutions.length) {
            for (let i = feedCounter; i < feedbacks.length; i++)
                solutionsAndFeedbacks.push(["Feedback", feedbacks[i]]);
            break;
        }
        if (feedCounter === feedbacks.length) {
            for (let i = solCounter; i < solutions.length; i++)
                solutionsAndFeedbacks.push(["Solution", solutions[i]]);
            break;
        }

        let [currentSolution, currentFeedback] = [solutions[solCounter], feedbacks[feedCounter]];
        if (currentSolution.dateTime > currentFeedback.dateTime) {
            solCounter++;
            solutionsAndFeedbacks.push(["Solution", currentSolution]);
        } else {
            feedCounter++;
            solutionsAndFeedbacks.push(["Feedback", currentFeedback]);
        }
    }

    return solutionsAndFeedbacks;
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
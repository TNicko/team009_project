const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const conn = require("../db/dbconfig.js");
const Ticket = require("../models/ticketModel");
const TicketLog = require("../models/ticketLogModel");
const Solution = require("../models/solutionModel");
const User = require("../models/userModel");
const Hardware = require("../models/hardwareModel");
const Software = require("../models/softwareModel");
const OS = require("../models/osModel");
const Account = require('../models/accountModel.js');
const Feedback = require('../models/feedbackModel');
const Os = require('../models/osModel');
const Expertise = require("../models/expertiseModel");

const statusOrderQuery = `
CASE status
    WHEN 'unsuccessful' THEN 1
    WHEN 'submitted' THEN 2
    WHEN 'active' THEN 3
    WHEN 'closed' THEN 4
    ELSE 5
END`;

const resultsPerPage = 10;
const pageStart = (p) => resultsPerPage * (p - 1);

// Checks user type logged in and renders home page for correct user.
router.get('/', checkAuthenticated(['user', 'admin', 'specialist', 'external specialist', 'analyst']), async (req, res) => {
    let user = await User.getById(conn, req.user.id);

    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let search = req.query.search === undefined ? null : req.query.search;
    let problemType = (req.query.problemType === undefined) || (req.query.problemType === "") ? "%" : req.query.problemType;
    let status = req.query.status === undefined ? null : req.query.status;
    let sortBy = req.query.sortBy === undefined ? null : req.query.sortBy;

    let filterColumns = [];
    let filterValues = [];
    let operators = [];

    if (status !== null && status !== "") {
        operators.push(" AND ");
        filterColumns.push("status");
        filterValues.push(status);
    }

    operators.push("");

    let [sortColumn, sortType] = [statusOrderQuery, ""];
    if (sortBy !== null)
        [sortColumn, sortType] = parseSort(sortBy);

    if (user.type === 'admin') {
        let type = req.query.type;
        let ticket_table_total = await Ticket.getCount(conn);
        let ticket_total = await Ticket.getCount(conn);
        let assigned_total = await Ticket.getCount(conn,
            ['status', 'status', 'status'],
            ['active', 'unsuccessful', 'submitted'],
            ['OR', 'OR', '']);
        let open_total = await Ticket.getCount(conn,
            ['handler_id'],
            [null],
            ['']);

        let tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, filterColumns,
            filterValues, operators, sortColumn, sortType, search, problemType);
        if (type === "Unassigned") {
            tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, ['handler_id'], [null], [''], statusOrderQuery, '', search);
            ticket_table_total = open_total;
        }
        if (type === "Assigned") {
            tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage,
                ['handler_id', 'status', 'status', 'status'],
                ['isNotNull', 'active', 'unsuccessful', 'submitted'],
                ['AND (', 'OR', 'OR', ')'],
                statusOrderQuery, '', search);

            ticket_table_total = assigned_total;
        }
        if (type === "Total") {
            tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, [], [], [],
                statusOrderQuery, '', search);

            ticket_table_total = ticket_total;
        }
        tickets = await augmentTicketUpdate(tickets);
        tickets = await mapOverdue(tickets);

        let o_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, filterColumns,
            filterValues, operators, sortColumn, sortType, search, problemType);
        o_tickets = await augmentTicketUpdate(o_tickets);
        o_tickets = await mapOverdue(o_tickets);
        let index = o_tickets.length;
        while (index--) {
            if (o_tickets[index].isOverdue === false) {
                o_tickets.splice(index, 1);
            }
        }
        if (type === "Overdue") {
            ticket_table_total = o_tickets.length;
            tickets = o_tickets;
        }

        res.render('./index/admin', {
            username: req.user.username,
            url: 'admin',
            tickets: tickets,
            usertype: user.type,
            ticket_table_total: ticket_table_total,
            ticket_total: ticket_total,
            assigned_total: assigned_total,
            open_total: open_total,
            overdue_ticket_total: o_tickets.length,
            page: page
        });
    }
    if (user.type === 'user') {
        filterColumns.push('user_id');
        filterValues.push(user.id);

        let ticket_table_total = await Ticket.getCount(conn, filterColumns, filterValues, operators);
        let tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, filterColumns, filterValues, operators,
            sortColumn, sortType, search, problemType);
        tickets = await augmentTicketUpdate(tickets);

        res.render('./index/user', {
            username: req.user.username,
            url: 'user',
            tickets: tickets,
            usertype: user.type,
            ticket_table_total: ticket_table_total,
            page: page
        });
    }
    if (user.type === 'specialist') {
        filterColumns.push('handler_id');
        filterValues.push(user.id);

        let type = req.query.type;
        let handlerId = 'handler_id';
        let ticket_total = await Ticket.getCount(conn, [handlerId], [user.id], ['']);
        let ticket_table_total = ticket_total;
        let closed_total = await Ticket.getCount(conn, [handlerId, 'status'], [user.id, 'closed'], ['AND', '']);
        let assigned_total = await Ticket.getCount(conn, [handlerId, 'status', 'status', 'status'], [user.id, 'active', 'unsuccessful', 'submitted'], ['AND (', 'OR', 'OR', ')']);
        let open_total = await Ticket.getCount(conn, [handlerId], [null], ['']);
        let spec_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, filterColumns, filterValues, operators, sortColumn,
            sortType, search, problemType);
        if (type === "Total") {
            spec_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, [handlerId], [user.id], [''],
                statusOrderQuery, '', search);

            ticket_table_total = ticket_total;
        }
        if (type === "Resolved") {
            spec_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage,
                [handlerId, 'status'],
                [user.id, 'closed'],
                ['AND', ''],
                statusOrderQuery, '', search);

            ticket_table_total = closed_total;
        }
        if (type === "Assigned") {
            spec_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage,
                [handlerId, 'status', 'status', 'status'],
                [user.id, 'active', 'unsuccessful', 'submitted'],
                ['AND (', 'OR', 'OR', ')'],
                statusOrderQuery, '', search);

            ticket_table_total = assigned_total;
        }

        spec_tickets = await augmentTicketUpdate(spec_tickets);
        spec_tickets = await mapOverdue(spec_tickets);

        let o_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, filterColumns, filterValues,
            operators, sortColumn, sortType, search, problemType);
        o_tickets = await augmentTicketUpdate(o_tickets);
        o_tickets = await mapOverdue(o_tickets);
        let index = o_tickets.length;
        while (index--) {
            if (o_tickets[index].isOverdue === false) {
                o_tickets.splice(index, 1);
            }
        }
        if (type === "Overdue") {
            ticket_table_total = o_tickets.length;
            spec_tickets = o_tickets;
        }

        let openPage = req.query.openPage === undefined ? 1 : parseInt(req.query.openPage);
        let open_tickets = await Ticket.getAll(conn, pageStart(openPage), resultsPerPage, [handlerId], [null], [''], null, null, search);
        open_tickets = await augmentTicketUpdate(open_tickets);

        res.render('./index/specialist', {
            username: req.user.username,
            url: 'specialist',
            usertype: user.type,
            spec_tickets: spec_tickets,
            open_tickets: open_tickets,
            ticket_table_total: ticket_table_total,
            ticket_total: ticket_total,
            assigned_total: assigned_total,
            open_total: open_total,
            closed_total: closed_total,
            overdue_ticket_total: o_tickets.length,
            page: page,
            openPage: openPage,
        });
    }
    if (user.type === 'external specialist') {
        let handlerId = 'handler_id';
        let ticket_total = await Ticket.getCount(conn,
            [handlerId],
            [user.id],
            ['']);
        let ticket_table_total = ticket_total;
        let spec_tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage, [handlerId], [user.id], [''], null, null, search);
        spec_tickets = await augmentTicketUpdate(spec_tickets);
        res.render('./index/ext_specialist', {
            username: req.user.username,
            url: 'ex_spec',
            usertype: user.type,
            spec_tickets: spec_tickets,
            ticket_table_total: ticket_table_total,
            page: page
        });
    }
    if (user.type === 'analyst') {
        // passes list of software, list of users and and the count for each software and users
        // the count for the software is to check how many times it has appeared on tickets and
        // same with the users(handlers), counts how many tickets the handler has attached to them 
        let countPerHandler = {};
        let listOfTickets = await Ticket.getAll(conn, 0, 1000);
        let listOfUsers = await User.getAll(conn, 0, 1000, "job", "specialist");
        let softwareListGet = await Software.getAll(conn, 0, 1000);
        let softwareList = [];
        let countPerSoftware = {};
        let listOfOsesGet = await Os.getAll(conn, 0, 1000);
        let countPerOses = {};
        let listOfOses = [];
        let statuses = ["closed", "submitted", "active", "unsuccessful"];
        let countPerStatus = {};
        let listOfHardwareGet = await Hardware.getAll(conn, 0, 1000);
        let hardwareList = [];
        let countPerHardware = {};
        let totalSoftware = 0;
        let totalOs = 0;
        let totalHardware = 0;
        let problemTypes = ["software", "hardware", "os"];
        let totalCounts = {};

        listOfHardwareGet.forEach(function (hardware) {
            hardwareList.push(hardware.name);
            let hardwareCount = 0;
            listOfTickets.forEach(function (ticket) {
                ticket.hardwares.forEach(function (list) {
                    if (list["name"] == hardware.name) {
                        hardwareCount++;
                    }
                })
            })
            countPerHardware[hardware.name] = hardwareCount;

        })

        softwareListGet.forEach(function (software) {
            softwareList.push(software.name);
            let softwareCount = 0;
            listOfTickets.forEach(function (ticket) {
                ticket.softwares.forEach(function (list) {
                    if (list["name"] == software.name) {
                        softwareCount++;
                    }
                })
            })
            countPerSoftware[software.name] = softwareCount;
        })

        listOfOsesGet.forEach(function (os) {
            listOfOses.push(os.name);
            let osCount = 0;
            listOfTickets.forEach(function (ticket) {
                ticket.oses.forEach(function (list) {
                    if (list["name"] == os.name) {
                        osCount++;
                    }
                })
            })
            countPerOses[os.name] = osCount;
        })

        listOfUsers.forEach(function (user) {
            let count = 0;
            listOfTickets.forEach(function (ticket) {
                if (ticket.handlerId == user.id) {
                    count++;
                }

            })

            countPerHandler[user.name] = count;

        })


        statuses.forEach(function (status) {
            let statusCount = 0;
            listOfTickets.forEach(function (ticket) {
                if (ticket.status == status) {
                    statusCount++;
                }
            })
            countPerStatus[status] = statusCount;
        })

        listOfTickets.forEach(function (ticket) {
            if (ticket.oses.length != 0) {
                totalOs++;
            }
            if (ticket.hardwares.length != 0) {
                totalHardware++;
            }
            if (ticket.softwares.length != 0) {
                totalSoftware++;
            }
        })

        totalCounts["hardware"] = totalHardware;
        totalCounts["software"] = totalSoftware;
        totalCounts["os"] = totalOs;

        res.render('./index/analyst', {
            username: req.user.username,
            usertype: user.type,
            users: listOfUsers,
            counted: countPerHandler,
            pureSoftwareList: softwareList,
            softwareCount: countPerSoftware,
            osCount: countPerOses,
            osList: listOfOses,
            statuses: statuses,
            statusCount: countPerStatus,
            hardwareCount: countPerHardware,
            hardwareList: hardwareList,
            totalCounts: totalCounts,
            problemTypes: problemTypes
        });
    }
})

// Tables
router.get('/hardware', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let search = req.query.search;
    if (search === undefined)
        search = null;

    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let user = await User.getById(conn, req.user.id);
    let hardwares = await Hardware.getAll(conn, pageStart(page), resultsPerPage, search);
    let hardware_total = await Hardware.getCount(conn);

    res.render('./tables/hardware', {
        username: req.user.username,
        usertype: user.type,
        hardwares: hardwares,
        hardware_total: hardware_total,
        page: page,
    });
})
router.get('/software', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let search = req.query.search;
    if (search === undefined)
        search = null;

    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let user = await User.getById(conn, req.user.id);
    let softwares = await Software.getAll(conn, pageStart(page), resultsPerPage, search);
    let software_total = await Software.getCount(conn);
    res.render('./tables/software', {
        username: req.user.username,
        usertype: user.type,
        softwares: softwares,
        software_total: software_total,
        page: page,
    });
})
router.get('/os', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let search = req.query.search;
    if (search === undefined)
        search = null;

    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let user = await User.getById(conn, req.user.id);
    let os = await OS.getAll(conn, pageStart(page), resultsPerPage, search);
    let os_total = await OS.getCount(conn);
    res.render('./tables/os', {
        username: req.user.username,
        usertype: user.type,
        os: os,
        os_total: os_total,
        page: page
    });
})
// Update table endpoints
router.put('/hardware', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let body = req.body;
    await Hardware.update(conn, body.oldSerial, body.newSerial, body.newName);
    res.sendStatus(200)
});
router.put('/software', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let body = req.body;
    await Software.update(conn, body.oldSerial, body.newSerial, body.newName);
    res.sendStatus(200)
});
router.put('/os', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let body = req.body;
    await OS.update(conn, body.oldSerial, body.newSerial, body.newName);
    res.sendStatus(200)
});
// Add new to table endpoints
router.post('/hardware', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let body = req.body;
    await Hardware.add(conn, body.serial, body.name);
    res.sendStatus(200)
});
// Add new to table endpoints
router.post('/software', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let body = req.body;
    await Software.add(conn, body.serial, body.name);
    res.sendStatus(200)
});
// Add new to table endpoints
router.post('/os', checkAuthenticated(['specialist', 'admin', 'analyst']), async (req, res) => {
    let body = req.body;
    await OS.add(conn, body.serial, body.name);
    res.sendStatus(200)
});

// Other
router.get('/ticket/:id', checkAuthenticated(['specialist', 'admin', 'analyst', 'external specialist', 'user']), async (req, res) => {
    let ticketId = req.params.id;
    let ticket = await Ticket.getById(conn, ticketId);
    let user = await User.getById(conn, ticket.userId);
    let currentUser = await User.getById(conn, req.user.id);

    // Redirect user to home page if ticket is not theirs
    if (currentUser.type === "user")
        if (user.id !== req.user.id)
            res.redirect('/');

    let logs = await TicketLog.getAllForTicketId(conn, ticketId);
    let solutions = await Solution.getAllForTicketId(conn, ticketId);
    let feedbacks = await Feedback.getAllForTicketId(conn, ticketId);
    let combined = combineSolutionsAndFeedbacks(solutions, feedbacks);
    let lastUpdated = await getLastUpdatedDate(ticketId);

    logs = await Promise.all(
        logs.map(async (v) => ({
            ...v,
            updateDate: await formatDate(new Date(v.updateDate))
        }))
    );

    let specialistName = "None";
    if (ticket.handlerId !== null) {
        let specialist = await User.getById(conn, ticket.handlerId);
        specialistName = specialist.name;
    }

    let data = {
        username: req.user.username,
        usertype: currentUser.type,
        currentUserId: req.user.id,
        ticket: ticket,
        user: user,
        logs: logs,
        solutionsAndFeedbacks: combined,
        lastUpdated: lastUpdated,
        specialistName: specialistName,
    };

    res.render('./ticket-information', data);
})
router.put('/ticket', checkAuthenticated(['specialist', 'admin', 'external specialist', 'user']), async (req, res) => {
    let body = req.body;
    try {
        let oldTicket = await Ticket.getById(conn, body.id);
        await Ticket.updateById(conn, body.id, null, null, body.title, body.notes);
        if (oldTicket.description !== body.title) {
            console.log('changed');
            await TicketLog.createForTicket(conn, body.id, 'description', body.title);
        }
        if (oldTicket.notes !== body.notes) {
            console.log(' notes changed');
            await TicketLog.createForTicket(conn, body.id, 'notes', body.notes);
        }
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})
router.post('/ticket/:id/close', checkAuthenticated(['specialist', 'admin', 'external specialist', 'user']), async (req, res) => {
    let ticketId = req.params.id;
    try {
        await Ticket.updateById(conn, ticketId, null, "closed");
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})
router.post('/ticket/:id/feedback', checkAuthenticated(['user']), async (req, res) => {
    let ticketId = req.params.id;
    let body = req.body;
    try {
        await Feedback.createForTicket(conn, ticketId, body.feedback, req.user.id);
        await Ticket.updateById(conn, ticketId, null, "unsuccessful");
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})
router.post('/ticket/:id/solution', checkAuthenticated(['specialist']), async (req, res) => {
    let ticketId = req.params.id;
    let body = req.body;
    try {
        await Solution.createForTicket(conn, ticketId, "pending", req.user.id, body.solution);
        await Ticket.updateById(conn, ticketId, null, "submitted");
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})
router.post('/ticket/assign', checkAuthenticated(['admin', 'specialist']), async (req, res) => {
    try {
        let body = req.body;
        await Ticket.updateById(conn, body.ticket, null, null, null, null, body.specialist);
        if (body.specialist === -1) {
            let user = await User.getById(conn, req.user.id);
            await TicketLog.createForTicket(conn, body.ticket, 'specialist dropped', user.name);
        } else {
            let user = await User.getById(conn, body.specialist);
            await TicketLog.createForTicket(conn, body.ticket, 'specialist assigned', user.name);
        }

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})
router.post('/ticket/submit', checkAuthenticated(['user']), async (req, res) => {
    try {
        let body = req.body;
        let ticketId = await Ticket.create(conn, req.user.id, "active", body.title, body.notes, null, new Date());

        if (body.isHardware) await Expertise.addToTicket(conn, ticketId, "hardware");
        if (body.isSoftware) await Expertise.addToTicket(conn, ticketId, "software");
        if (body.isNetwork) await Expertise.addToTicket(conn, ticketId, "network");

        for (const serial of body.serials) {
            if (serial.serialType === "hardware") await Hardware.addToTicket(conn, serial.serial, ticketId);
            if (serial.serialType === "software") await Software.addToTicket(conn, serial.serial, ticketId);
            if (serial.serialType === "os") await OS.addToTicket(conn, serial.serial, ticketId);
        }


        res.send(JSON.stringify(
            {
                success: true,
                id: ticketId
            }
        ));
    } catch (err) {
        res.send(JSON.stringify(
            {
                success: false,
                reason: "Unable to create ticket: " + err.message
            }
        ));
    }
})
router.get('/account', checkAuthenticated(['specialist', 'admin', 'analyst', 'external specialist', 'user']), async (req, res) => {
    let user = await User.getById(conn, req.user.id);
    res.render('./account', {
        username: req.user.username,
        usertype: user.type,
        user: user
    });
})
router.post('/users/create/ext', checkAuthenticated(["admin"]), async (req, res) => {
    try {
        let body = req.body;
        let userId = await User.create(
            conn, body.name,
            "External Specialist", "External Specialist", body.telephone, "external specialist"
        );
        let hashedPassword = await hashPassword(body.password);
        await Account.create(conn, userId, body.username, hashedPassword);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})
router.get('/submit_problem', checkAuthenticated(['user']), async (req, res) => {
    let user = await User.getById(conn, req.user.id);

    let hardwares = await Hardware.getAll(conn, 0, 1000);
    let softwares = await Software.getAll(conn, 0, 1000);
    let oses = await OS.getAll(conn, 0, 1000);

    res.render('./submit_problem', {
        username: req.user.username,
        usertype: user.type,
        hardwares: hardwares,
        softwares: softwares,
        oses: oses,
        errors: null
    });
})
router.get('/all_tickets', checkAuthenticated(['specialist']), async (req, res) => {
    let user = await User.getById(conn, req.user.id);
    let ticket_table_total = await Ticket.getCount(conn);

    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let search = req.query.search === undefined ? null : req.query.search;
    let problemType = (req.query.problemType === undefined) || (req.query.problemType === "") ? "%" : req.query.problemType;
    let status = req.query.status === undefined ? null : req.query.status;
    let sortBy = req.query.sortBy === undefined ? null : req.query.sortBy;

    let filterColumns = [];
    let filterValues = [];
    let operators = [];

    if (status !== null && status !== "") {
        operators.push(" AND ");
        filterColumns.push("status");
        filterValues.push(status);
    }

    operators.push("");

    let [sortColumn, sortType] = [statusOrderQuery, ""];
    if (sortBy !== null)
        [sortColumn, sortType] = parseSort(sortBy);
console.log(search);
    let tickets = await Ticket.getAll(conn, pageStart(page), resultsPerPage,
        filterColumns, filterValues, operators, sortColumn, sortType, search, problemType);
    tickets = await augmentTicketUpdate(tickets);
    res.render('./all_tickets', {
        url: 'all_tickets',
        username: req.user.username,
        usertype: user.type,
        tickets: tickets,
        ticket_table_total: ticket_table_total,
        page: page
    });
})
router.get('/users', checkAuthenticated(['admin']), async (req, res) => {
    let user = await User.getById(conn, req.user.id);
    let specialists = await User.getAll(conn, 0, 100, "account_type", "specialist");
    let extSpecialists = await User.getAll(conn, 0, 100, "account_type", "external specialist");
    let tickets = await Ticket.getAll(conn, 0, 100, ["status"], ["active"], ['']);

    res.render('./users', {
        username: req.user.username,
        usertype: user.type,
        specialists: [...specialists, ...extSpecialists],
        tickets: tickets
    });
})
router.get('/change_password', checkAuthenticated(['specialist', 'admin', 'analyst', 'external specialist', 'user']), async (req, res) => {
    res.render('./change_password', {
        username: req.user.username,
        errors: null
    });
})
router.get('/solution_history', checkAuthenticated(['user']), async (req, res) => {
    let search = req.query.search;
    if (search === undefined) search = null;

    let page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    let problemType = req.query.problemType;
    if (problemType === undefined) problemType = null;

    let sortDateBy = req.query.sortDateBy;
    if (sortDateBy === undefined) problemType = null;
    if (sortDateBy === 'asc') sortDateBy = 'ASC';
    else sortDateBy = 'DESC';

    let user = await User.getById(conn, req.user.id);
    let solutions = await Solution.getAllSuccessSolution(conn, search, problemType, sortDateBy,
        pageStart(page), resultsPerPage);
    res.render('./solution_history', {
        username: req.user.username,
        usertype: user.type,
        solutions: solutions,
        page: page,
    });
})
// Change Password validation
router.post('/change_password', checkAuthenticated(['specialist', 'admin', 'analyst', 'external specialist', 'user']),
    check('confirm_password')
        .isLength({min: 5})
        .withMessage('Password must be at least 5 characters')
        .custom(async (confirmPassword, {req}) => {
            const password = req.body.password;
            if (password !== confirmPassword) {
                throw new Error('Passwords must be the same')
            }
        }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('change_password', {errors: errors.array()});
        } else {
            console.log("Changing password...");
            const password = req.body.password;
            const hashedPassword = await hashPassword(password);
            Account.updatePasswordById(conn, req.user.id, hashedPassword);
            res.redirect("/login");
        }
    });

/**
 * Gets and returns the last updated date for a specific ticket
 * @param {int} ticketId ticket's id
 */
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
        // Get last updated date 
        const max = new Date(Math.max(...arr));
        const dateTime = formatDate(max);
        return dateTime;
    } else {
        // Get date created here
        let ticket = await Ticket.getById(conn, ticketId);
        let create_date = new Date(ticket.createdAt);
        let dateTime = formatDate(create_date);
        return dateTime;
    }
}

// Reformats Date
async function formatDate(mDate) {
    let mins = mDate.getMinutes();
    if (mins < 10) {
        mins = "0" + mins;
    }
    const date = mDate.getDate() + '/' + (mDate.getMonth() + 1) + '/' + mDate.getFullYear();
    const time = mDate.getHours() + ":" + mins;
    const dateTime = date + ', ' + time;
    return dateTime;
}

/**
 * Appends update date for each ticket object and returns updated list
 * @param {object} tickets list of all ticket objects
 */
async function augmentTicketUpdate(tickets) {
    tickets = await Promise.all(
        tickets.map(async (v) => ({
            ...v,
            updateDate: await getLastUpdatedDate(v.ticketId)
        }))
    );
    return tickets;
}

/**
 * Appends boolean value to each ticket object and returns updated list
 * @param {object} tickets list of all ticket objects
 */
async function mapOverdue(tickets) {
    tickets = await Promise.all(
        tickets.map(async (v) => ({
            ...v,
            isOverdue: await checkOverdue(v)
        }))
    );
    return tickets;
}

// Checks if a ticket is overdue and returns boolean
async function checkOverdue(ticket) {

    const updateDate = ticket.updateDate;
    const currentDate = new Date();
    const ticketDate = new Date(updateDate);

    const diffTime = Math.abs(currentDate - ticketDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7 && ticket.status !== 'closed') {
        return true;
    } else {
        return false;
    }
}

// Hash password
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

/**
 * Redirects to login if not authenticated
 * Redirects to home if user does not have access to page
 * @param {object} userTypes list of all user types that have access to view
 */
function checkAuthenticated(userTypes) {
    return async (req, res, next) => {
        if (req.isAuthenticated()) {
            let user = await User.getById(conn, req.user.id);
            if (userTypes.includes(user.type)) {
                return next();
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/login')
        }
    }
}

// Redirects to homepage if user authenticated
function checkNoAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    next()
}

// Utility function to combine a list of solutions objects and list of feedback objects for a single ticket. 
// Sorts in chronological order.
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

// Parse ticket_table.ejs sort details
function parseSort(text) {
    let sortColumn = "created_at";
    let sortType = "DESC";

    if (text.endsWith("asc")) sortType = "ASC";
    if (text.endsWith("desc")) sortType = "DESC";

    if (text.startsWith("title")) sortColumn = "description";
    if (text.startsWith("id")) sortColumn = "ticketId";
    if (text.startsWith("date")) sortColumn = "created_at";

    return [sortColumn, sortType];

}

module.exports = router;
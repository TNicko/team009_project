const express = require('express');
const conn = require("../db/dbconfig.js");
const Employee = require("../models/employeeModel");

const router = express.Router();

router.get('/', (req, res) => {
    Employee.getAll(conn, (results) => {
        res.render('employee', {employees: results});
    });
})

module.exports = router;
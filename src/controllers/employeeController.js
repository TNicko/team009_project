const express = require('express');
const conn = require("../db/dbconfig.js");
const Employee = require("../models/employeeModel");

const router = express.Router();

router.get('/', async (_, res) => {
    let result = await Employee.getAll(conn);
    res.render('employee', { employees: result });
})

module.exports = router;
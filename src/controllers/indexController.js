const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { name: 'nickolai'});
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
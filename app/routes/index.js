const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../services/authentication');


//login page
router.get('/', (req, res) => {
    res.redirect(301, '/users/login');
})

// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user
    });
})

module.exports = router; 
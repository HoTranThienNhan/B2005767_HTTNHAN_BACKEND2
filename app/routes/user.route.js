const express = require('express');
const users = require('../controllers/user.controller');

const router = express.Router();

router.route('/signin')
    .post(users.signin);

router.route('/signup')
    .post(users.signup);

router.route('/findByEmail/:id')
    .get(users.findByEmail);

module.exports = router;
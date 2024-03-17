const express = require('express');
const router = express.Router();
const { registerGuest, loginGuest } = require('../controller/guestController');

router.post('/register',  registerGuest);

router.post('/login', loginGuest);

module.exports = router;
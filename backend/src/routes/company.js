const router = require('express').Router();

const { addGuestToCompany } = require('../controller/guest');

router.post('/add-guest', addGuestToCompany)

module.exports = router;
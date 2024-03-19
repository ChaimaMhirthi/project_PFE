const router = require('express').Router();

const { addGuestToCompany,deleteGuest } = require('../controller/guest');

router.post('/add-guest', addGuestToCompany)
router.delete('/delete-guest/:id', deleteGuest)
module.exports = router;
const router = require('express').Router();

const { addGuestToCompany,deleteGuest,addCompanyOwnerToGuest } = require('../controller/guest');

router.post('/add-guest', addGuestToCompany)
router.post('/add-company-owner/:id', addCompanyOwnerToGuest)

router.delete('/delete-guest/:id', deleteGuest)
module.exports = router;
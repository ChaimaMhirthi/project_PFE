const router = require('express').Router();

const { addGuestToCompany,deleteGuest,addCompanyOwnerToGuest,loginGuest,registerGuest } = require('../controller/guest');

router.post('/add-guest', addGuestToCompany);
router.post('/add-company-owner/:id', addCompanyOwnerToGuest);
router.post('login-guest',loginGuest);
router.post('/register-guest',registerGuest);
router.delete('/delete-guest/:id', deleteGuest);
module.exports = router;
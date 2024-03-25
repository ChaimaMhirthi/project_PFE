const router = require('express').Router();
const { registerCompany, loginCompany } = require('../controller/auth');


router.post('/register-company',registerCompany);
router.post('/login-company', loginCompany);



module.exports = router;
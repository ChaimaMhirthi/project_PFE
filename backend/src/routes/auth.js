const router = require('express').Router();
const { registerCompany, loginCompany } = require('../controller/auth');


router.post('/registercompany',registerCompany);
router.post('/logincompany', loginCompany);



module.exports = router;
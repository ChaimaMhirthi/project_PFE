const router = require('express').Router();
const { adminLogin,getManagerName,registerUser, login,verifyOTP,forgotPassword,resetPassword ,resendOTPByEmail } = require('../controller/auth');




router.post('/manager-register', (req, res) => registerUser(req, res, 'manager'));
router.post('/manager-login', (req, res) => login(req, res, 'manager'));
router.post('/manager-verify-otp', (req, res) => verifyOTP(req, res, 'manager'));
router.post('/manager-reset-password', (req, res) => resetPassword(req, res, 'manager'));
router.post('/manager-forgot-password', (req, res) => forgotPassword(req, res, 'manager'));
router.post('/manager-resend-otp', (req, res) => resendOTPByEmail(req, res, 'manager'));

router.post('/employee-register', (req, res) => registerUser(req, res, 'employee'));
router.post('/employee-login', (req, res) => login(req, res, 'employee'));
router.post('/employee-verify-otp', (req, res) => verifyOTP(req, res, 'employee'));
router.post('/employee-reset-password', (req, res) => resetPassword(req, res, 'employee'));
router.post('/employee-forgot-password', (req, res) => forgotPassword(req, res, 'employee'));
router.post('/employee-resend-otp', (req, res) => resendOTPByEmail(req, res, 'employee'));


router.post('/superAdmin-login',adminLogin );


router.get('/get-allmanager',getManagerName);



module.exports = router;
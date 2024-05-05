const router = require('express').Router();
const { registerUser, login,verifyOTP,forgotPassword,resetPassword ,resendOTPByEmail } = require('../controller/auth');




router.post('/company-register', (req, res) => registerUser(req, res, 'company'));
router.post('/company-login', (req, res) => login(req, res, 'company'));
router.post('/company-verify-otp', (req, res) => verifyOTP(req, res, 'company'));
router.post('/company-reset-password', (req, res) => resetPassword(req, res, 'company'));
router.post('/company-forgot-password', (req, res) => forgotPassword(req, res, 'company'));
router.post('/company-resend-otp', (req, res) => resendOTPByEmail(req, res, 'company'));

router.post('/employee-register', (req, res) => registerUser(req, res, 'employee'));
router.post('/employee-login', (req, res) => login(req, res, 'employee'));
router.post('/employee-verify-otp', (req, res) => verifyOTP(req, res, 'employee'));
router.post('/employee-reset-password', (req, res) => resetPassword(req, res, 'employee'));
router.post('/employee-forgot-password', (req, res) => forgotPassword(req, res, 'employee'));
router.post('/employee-resend-otp', (req, res) => resendOTPByEmail(req, res, 'employee'));




module.exports = router;
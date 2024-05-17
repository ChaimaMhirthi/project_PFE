const router = require('express').Router();
const {  getAllEmployee ,updateEmployee,deleteEmployee ,getAllCompany ,deleteCompany,updateCompany,CreateUser} = require('../controller/users');
const {  isSuperAdmin } = require('../middleware/authenticationToken');
const { multerUploadProfileImage } = require('../config/multer');


// employees management
router.get('/get-allemployee',getAllEmployee);
router.post('/update-employee',updateEmployee);
router.delete('/delete-employee/:employeeId',deleteEmployee);
router.post('/create-employee', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'employee'));

// company management
router.post('/create-company', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'company'));

router.get('/get-allcompany',getAllCompany);
router.post('/update-company',updateCompany);
router.delete('/delete-company/:companyId',deleteCompany);

module.exports = router;
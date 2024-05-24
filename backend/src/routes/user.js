const router = require('express').Router();
const {  getAllEmployeeNames,getManager,getEmployee,getAllEmployee ,updateEmployee,deleteEmployee ,getAllManager ,deleteManager,updateManager,CreateUser} = require('../controller/users');
const {  isSuperAdmin } = require('../middleware/authenticationToken');
const { multerUploadProfileImage } = require('../config/multer');


// employees management
router.get('/get-allemployee',getAllEmployee);
router.get('/get-allemployeeNames',getAllEmployeeNames);

router.get('/get-employee/:employeeId',getEmployee);

router.post('/update-employee', multerUploadProfileImage.any(),updateEmployee);
router.delete('/delete-employee/:employeeId',deleteEmployee);
router.post('/create-employee', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'employee'));

// manager management
router.post('/create-manager', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'manager'));

router.get('/get-allmanager',getAllManager);
router.get('/get-manager/:managerId',getManager);
router.post('/update-manager', multerUploadProfileImage.any(),updateManager);
router.delete('/delete-manager/:managerId',deleteManager);

module.exports = router;
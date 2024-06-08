const router = require('express').Router();
const {  getAllAssigneeNames,getManager,getEmployee,getAllEmployee ,deleteEmployee ,getAllManager ,deleteManager,UpdateUser,CreateUser} = require('../controller/users');
const {  isSuperAdmin } = require('../middleware/authenticationToken');
const { multerUploadProfileImage } = require('../config/multer');


// employees management
router.get('/get-allemployee',getAllEmployee);
router.get('/get-allassignee',getAllAssigneeNames);

router.get('/get-employee/:employeeId',getEmployee);

router.post('/update-employee', multerUploadProfileImage.any(),(req, res) => UpdateUser(req, res, 'employee'));
router.post('/update-manager', multerUploadProfileImage.any(),(req, res) => UpdateUser(req, res, 'manager'));

router.post('/create-employee', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'employee'));

// manager management
router.post('/create-manager', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'manager'));

router.get('/get-allmanager',getAllManager);
router.get('/get-manager/:managerId',getManager);

router.delete('/delete-manager/:managerId',deleteManager);
router.delete('/delete-employee/:employeeId',deleteEmployee);

module.exports = router;
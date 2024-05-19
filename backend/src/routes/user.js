const router = require('express').Router();
const {  getAllEmployee ,updateEmployee,deleteEmployee ,getAllManager ,deleteManager,updateManager,CreateUser} = require('../controller/users');
const {  isSuperAdmin } = require('../middleware/authenticationToken');
const { multerUploadProfileImage } = require('../config/multer');


// employees management
router.get('/get-allemployee',getAllEmployee);
router.post('/update-employee',updateEmployee);
router.delete('/delete-employee/:employeeId',deleteEmployee);
router.post('/create-employee', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'employee'));

// manager management
router.post('/create-manager', multerUploadProfileImage.any(),(req, res) => CreateUser(req, res, 'manager'));

router.get('/get-allmanager',getAllManager);
router.post('/update-manager',updateManager);
router.delete('/delete-manager/:managerId',deleteManager);

module.exports = router;
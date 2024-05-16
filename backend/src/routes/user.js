const router = require('express').Router();
const {  getAllEmployee ,updateEmployee,deleteEmployee ,getAllCompany ,deleteCompany,updateCompany} = require('../controller/users');
const {  isSuperAdmin } = require('../middleware/authenticationToken');


// employees management
router.get('/get-allemployee',getAllEmployee);
router.post('/update-employee',updateEmployee);
router.delete('/delete-employee/:employeeId',deleteEmployee);

// company management
router.get('/get-allcompany',getAllCompany);
router.post('/update-company',updateCompany);
router.delete('/delete-company/:companyId',deleteCompany);

module.exports = router;
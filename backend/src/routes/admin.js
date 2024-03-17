const express = require('express');
const router = express.Router();
const { registerAdmin,
    loginAdmin,
    createAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    getAllAdmins} = require('../controller/adminController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/create', createAdmin);
router.get('/:id', getAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.get('/', getAllAdmins);

module.exports = router;


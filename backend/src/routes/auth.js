const router = require('express').Router();

const { registerAdmin, loginAdmin, registerGuest, loginGuest } = require('../controller/auth');
const { getUserByEmail } = require('../controller/auth');




router.post('/registerAdmin', async (req, res) => {
    const adminData = req.body;
    try {
        const existingUser = await getUserByEmail(adminData.email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        if (!adminData.email || !adminData.password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = await registerAdmin(adminData);
        res.json(result);
    } catch (error) {
        console.error('Error in POST /registerAdmin:', error);
        res.status(500).json({ error: 'Error creating admin user' });
    }
});


router.post('/loginAdmin', async (req, res) => {
    const adminData = req.body;
    try {
        const user = await loginAdmin(adminData);
        res.json(user);
    } catch (error) {
        console.error('Error in POST /loginAdmin:', error);
        res.status(500).json({ error: 'Error logging in as admin' });
    }
});


router.post('/registerGuest', async (req, res) => {
    const guestData = req.body;
    try {
        const existingUser = await getUserByEmail(guestData.email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        if (!guestData.email || !guestData.password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = await registerGuest(guestData);
        res.json(result);
    } catch (error) {
        console.error('Error in POST /registerGuest:', error);
        res.status(500).json({ error: 'Error creating guest user' });
    }
});


router.post('/loginGuest', async (req, res) => {
    const guestData = req.body;
    try {
        const user = await loginGuest(guestData);
        res.json(user);
    } catch (error) {
        console.error('Error in POST /loginGuest:', error);
        res.status(500).json({ error: 'Error logging in as guest' });
    }
});

module.exports = router;


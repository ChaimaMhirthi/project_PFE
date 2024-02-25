const router = require('express').Router();

const { createUser, updateUser, deleteUser, getUserById, getAllUsers } = require('../controller/user');

router.post('/create', async (req, response) => {
    const userData = req.body;
    try {
        const result = await createUser(userData);
        response.json(result);
    } catch (error) {
        console.error('Error in POST /create:', error);
        response.status(500).json({ error: 'Error creating user' });
    }
});

router.get('/get/:id', async (req, response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await getUserById(id);
        response.json(result);
    } catch (error) {
        console.error('Error in GET /get:', error);
        response.status(500).json({ error: 'Error getting user' });
    }
});

router.get('/getAll', async (req, response) => {
    try {
        const result = await getAllUsers();
        response.json(result);
    } catch (error) {
        console.error('Error in GET /getAll:', error);
        response.status(500).json({ error: 'Error getting users' });
    }
});


router.put('/update/:id', async (req, response) => {
    const id = parseInt(req.params.id);
    const userData = req.body;
    try {
        const result = await updateUser(id, userData);
        response.json(result);
    } catch (error) {
        console.error('Error in PUT /update:', error);
        response.status(500).json({ error: 'Error updating user' });
    }
});

router.delete('/delete/:id', async (req, response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await deleteUser(id);
        response.json(result);
    } catch (error) {
        console.error('Error in DELETE /delete:', error);
        response.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;

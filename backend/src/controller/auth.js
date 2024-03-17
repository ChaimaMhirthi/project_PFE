const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const registerCompany = async  (req, res)  => {
    const { password, ...rest } = req.body;
    try {
        const user = await getUserByEmail(rest.email);
        if (user) {
            res.status(400).json({ error: 'Email already in use' });
        }

        const newCompany = await prisma.accountCompany.create({
            data: {
                ...rest,
                password: await bcrypt.hash(password, 10)
            }
        });
        
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

const loginCompany = asyncHandler(async (req, res) => {
    const userData = req.body;
    try {
        if (!userData.email || !userData.password) {
            res.status(400).json({ error: 'Invalid request please fill email and password fields' });
        }

        const user = await getUserByEmail(userData.email);
        if (!user) {
            res.status(400).json({ error: 'Invalid email' });
        }

        const match = await bcrypt.compare(userData.password, user.password);
        if (!match) {
            res.status(400).json({ error: 'Invalid password' });
        }

        const accessToken = jwt.sign(
            { user: { id: user.id } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60m" }
        );
        let userInfo = { ...user, password: undefined };
        res.status(200).json({ userInfo, accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

const getUserByEmail = async (email) => { 
    try {
        const user = await prisma.accountCompany.findUnique({
            where: {
                email: email
            }
        });
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

module.exports = { registerCompany, loginCompany };
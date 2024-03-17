const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');


const registerGuest = async (req, res) => {
    try {
        console.log('init')
        console.log(req.body)
        
        const { password, ...data } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
            const guest = await prisma.guest.create({
            data: {
                ...data,
                password: hashedPassword,
            }      
           
        });
    res.status(201).json({ message: 'Guest registered successfully', guest });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const loginGuest = async (req, res) => {
    try {
        const { email, password } = req.body;
        const guest = await prisma.guest.findFirst({ where: { email } });

        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }

        const passwordMatch = await bcrypt.compare(password, guest.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ id: guest.id }, 'secret_key');
        res.status(200).json({ message: 'Guest logged in successfully', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { registerGuest, loginGuest };
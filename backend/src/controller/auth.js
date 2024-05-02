const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const registerCompany = async (req, res) => {
    const { password, ...rest } = req.body;
    try {
        // Vérification de l'existence de l'utilisateur avec l'email fourni
        const user = await getUserByEmail(rest.email);
        if (user) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Création d'un nouveau hash pour le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création d'une nouvelle entreprise avec Prisma

        const newcompany = await prisma.company.create({
            data: {
                ...rest,
                password: hashedPassword
            }
        });
        console.log('After creating company with Prisma', newcompany);

        // Renvoi d'une réponse avec le nouvel objet créé
        return res.status(201).json(newcompany);
    } catch (error) {
        // Gestion des erreurs
        console.error('Error creating company:', error);
        return res.status(500).json({ error: 'Error creating company' });
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
            { 
                user: { 
                    companyId: user.id,
             } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "24h" }
        );
        let userInfo = { ...user, password: undefined };
        res.status(201).json( {accessToken} );
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

const getUserByEmail = async (email) => { 
    try {
        const user = await prisma.company.findUnique({
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
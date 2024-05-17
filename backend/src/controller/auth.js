const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv');
const crypto = require('crypto');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const nodemailer = require('nodemailer');
dotenv.config();


// Fonction pour générer un OTP aléatoire

const generateSecurePassword = (length) => {
    // Définir les caractères autorisés pour le mot de passe
    const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let password = '';
    // Générer chaque caractère du mot de passe
    for (let i = 0; i < length; i++) {
        // Choisir un caractère aléatoire parmi les caractères autorisés
        const randomIndex = crypto.randomInt(0, allowedCharacters.length);
        const randomCharacter = allowedCharacters[randomIndex];
        // Ajouter le caractère aléatoire au mot de passe
        password += randomCharacter;
    }
    // Retourner le mot de passe sécurisé
    return password;
};
const generateOTP = () => {
    const randomNum = crypto.randomInt(0, 999999);

    // Formater le nombre pour s'assurer qu'il a toujours 6 chiffres
    const randomDigits = randomNum.toString().padStart(6, '0');

    return randomDigits;
};
const generateToken = async () => {
    return crypto.randomBytes(20).toString('hex');
};
const sendPasswordByEmail = async (email, Token, Password, entityType) => {
    try {
        // Configuration du service SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hammaabbes5@gmail.com',
                pass: 'hpwj epfo zdkn zwdl'
            }
        });

        // Lien de réinitialisation du mot de passe avec le token
        const loginLink = `${process.env.LOGIN_LINK}?token=${encodeURIComponent(Token)}&user=${encodeURIComponent(entityType)}`;

        // Options de l'e-mail
        const mailOptions = {
            from: 'hammaabbes5@gmail.com',
            to: email,
            subject: 'Bienvenue dans notre entreprise',
            text: `Cher employé,\n\nBienvenue dans notre entreprise !\n\nVotre compte a été créé avec succès.\n\nVous pouvez vous connecter en cliquant sur ce lien : ${loginLink}\n\nCordialement,\nVotre équipe de support`,
            html: `<p>Cher employé,</p><p>Bienvenue dans notre entreprise !</p><p>Votre compte a été créé avec succès. \n\nVoici votre mot de passe :<h2>${Password}</h2> </p><p>Vous pouvez vous connecter en cliquant sur ce lien : <a href="${loginLink}">Connexion</a></p><p>Cordialement,<br>Votre équipe de support</p>`
        };
        // Envoi de l'e-mail

        const info = await transporter.sendMail(mailOptions); return info;
    } catch (error) {
        console.error('Error....:', error);
        throw new Error('Error ....');
    }
};
const sendResetByEmail = async (email, Token, entityType) => {
    try {
        // Configuration du service SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hammaabbes5@gmail.com',
                pass: 'hpwj epfo zdkn zwdl'
            }
        });

        // Lien de réinitialisation du mot de passe avec le token
        const resetLink = `${process.env.RESET_PASSWORD_LINK}?token=${encodeURIComponent(Token)}&user=${encodeURIComponent(entityType)}`;

        // Options de l'e-mail
        const mailOptions = {
            from: 'hammaabbes5@gmail.com',
            to: email,
            subject: 'Réinitialisation de mot de passe',
            text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetLink}`,
            html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :</p><p><a href="${resetLink}">Click here</a></p>`
        };

        // Envoi de l'e-mail

        const info = await transporter.sendMail(mailOptions); return info;
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Error sending reset email');
    }
};
const resendOTPByEmail = async (req, res, entityType) => {
    const { email } = req.body;
    try {
        const user = await getUserByEmail(email, entityType);
        if (!user) {
            return res.status(404).json({ error: 'Account not found' });
        }
        if (user.accountVerified) {
            return res.status(409).json({ error: 'Account is already valid ' });
        }
        if (user.otpExpiresAt && user.otpExpiresAt > new Date(Date.now())) {
            return res.status(401).json({ error: 'Please check your email, If the email is not received, please try again later ' });
        }
        const otp = generateOTP();        // Stockage de l'OTP dans la base de données
        await updateUser({
            where: { id: user.id },
            data: {
                otp: otp,
                otpExpiresAt: new Date(Date.now() + 900000),//15min :date d'expiration
            }
        }, entityType);
        // Appeler la fonction sendOTPByEmail avec les paramètres requis
        await sendOTPByEmail(email, otp, entityType);

        // Envoyer une réponse réussie
        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        // Gérer les erreurs
        console.error('Error resending OTP:', error);
        res.status(500).json({ error: 'Error resending OTP' });
    }
}

const sendOTPByEmail = async (email, otp, entityType) => {
    try {
        // Configuration du service SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hammaabbes5@gmail.com',
                pass: 'hpwj epfo zdkn zwdl'
            }
        });

        const verificationLink = `${process.env.OTP_VERIFICATION_LINK}?email=${encodeURIComponent(email)}&user=${encodeURIComponent(entityType)}`;
        // Options de l'email
        const mailOptions = {
            from: 'hammaabbes5@gmail.com',
            to: email,
            subject: 'Votre code OTP',
            text: ``,
            html: `Bonjour,<br><br>Cliquez sur le lien suivant pour vérifier votre compte : <a href="${verificationLink}">Click here</a><br><br><h2>Votre code OTP est : ${otp}</h2>`

        };

        // Envoi de l'email
        const info = await transporter.sendMail(mailOptions); return info;
    } catch (error) {
        console.error('Error sending OTP:', error);
        let errorMessage = 'Erreur lors de l\'envoi de l\'email';
        if (error.code === 'EAUTH') {
            errorMessage = 'Erreur d\'authentification lors de l\'envoi de l\'email. Veuillez vérifier vos informations d\'identification SMTP.';
        } else if (error.code === 'EENVELOPE') {
            errorMessage = 'Erreur d\'enveloppe lors de l\'envoi de l\'email. Veuillez vérifier les destinataires et l\'expéditeur de l\'email.';
        }
        throw new Error(errorMessage);
    }
};

const verifyOTP = async (req, res, entityType) => {

    const { email, otp } = req.body;
    try {
        // Rechercher l'utilisateur dans la base de données avec l'email
        const user = await getUserByEmail(email, entityType);

        if (!user) {
            return res.status(404).json({ error: 'Account expired' });
        }        // Vérifier si le" code OTP est correct et non expiré
        if (user.otpExpiresAt && user.otpExpiresAt > new Date(Date.now())) {
            if (!(user.otp === otp)) {
                { return res.status(401).json({ error: 'Invalid OTP code  ' }); }
            }
        }

        else {
            return res.status(401).json({ error: 'Expired OTP code ,You can request a new password reset link  OTP code ' });
        }

        await updateUser({
            where: {
                id: user.id
            },
            data: {
                accountVerified: true,
                otp: null,
                otpExpiresAt: null
            }
        }, entityType);

        return res.status(200).json({ message: 'Email successfully verified' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'There was an error verifying the email' });
    }
}
const forgotPassword = async (req, res, entityType) => {
    const { email, password } = req.body;
    try {
        // Vérifier si l'utilisateur existe
        const user = await getUserByEmail(email, entityType); if (!user) {
            return res.status(404).json({ error: 'Account not found' });
        }
        if (user.Token && user.TokenExpiresAt && user.TokenExpiresAt > new Date(Date.now())) {
            // Un token de réinitialisation existe et n'a pas expiré
            return res.status(401).json({ error: 'A password reset link has already been sent. Please check your email' });
        }

        // Générer un token de réinitialisation de mot de passe
        const Token = await generateToken();
        // Stocker le token dans la base de données avec l'ID de l'utilisateur et une date d'expiration
        if (Token) {
            await updateUser({
                where: {
                    email: email
                },
                data: {
                    Token: Token,
                    TokenExpiresAt: new Date(Date.now() + 90000000),//15min :date d'expiration
                }
            }, entityType);
        }
        // Envoyer un e-mail avec le lien de réinitialisation contenant le token
        await sendResetByEmail(email, Token, entityType);
        res.status(200).json({ message: 'Check your email for instructions on resetting your password' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending reset email' });
    }
}
const resetPassword = async (req, res, entityType) => {
    const { token, newPassword } = req.body;
    try {
        if (!token) {
            return res.status(400).json({ error: 'Missing Token' });
        }
        // Vérifier si le token de réinitialisation est valide et non expiré
        const user = await prisma[entityType].findUnique({
            where: { Token: token }
        });
        if (!user) {
            return res.status(404).json({ error: 'Authentication failed. Please check your email and password and try again' });
        } if ((user.TokenExpiresAt && user.TokenExpiresAt > new Date(Date.now()))) {
            if (user.Token !== token) {
                return res.status(401).json({ error: 'invalid reset token' });

            }

        }
        else {

            return res.status(401).json({ error: 'expired reset token You can request a new password reset link ' });
        }
        // Mettre à jour le mot de passe de l'utilisateur
        const passwordsMatch = await bcrypt.compare(newPassword, user.password);

        if (passwordsMatch) {
            console.log("passwd  match")

            return res.status(400).json({ error: 'Please enter a new password that you havent used before' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma[entityType].update({
            where: { Token: token },
            data: {
                password: hashedPassword,
                Token: null,
                TokenExpiresAt: null,
                accountVerified: true,
                otp: null,
                otpExpiresAt: null

            }
        });
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};



const registerUser = async (req, res, entityType) => {
    const { password, ...rest } = req.body;
    try {
        // Vérification de l'existence de l'utilisateur avec l'email fourni
        const user = await getUserByEmail(rest.email, entityType);
        if (user) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Création d'un nouveau hash pour le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création d'un nouveau user avec Prisma
        const newUser = await createUser({
            ...rest,
            password: hashedPassword
        }, entityType);

        // Génération de l'OTP en appelant la fonction importée
        const otp = generateOTP();

        // Stockage de l'OTP dans la base de données
        await updateUser({
            where: { id: newUser.id },
            data: {
                otp: otp,
                otpExpiresAt: new Date(Date.now() + 900000),//15min :date d'expiration
            }
        }, entityType);

        // Envoi de l'OTP par email à l'utilisateur
        await sendOTPByEmail(rest.email, otp, entityType);

        // Renvoi d'une réponse avec le nouvel objet créé
        res.status(200).json({ message: 'succes register and sending otp ', newUser });
    } catch (error) {
        // Gestion des erreurs
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message }); // Renvoi de l'erreur au client
    }
};

const login = asyncHandler(async (req, res, entityType) => {
    const { email, password, token } = req.body;
console.log({email});
console.log({password});
console.log({token});
console.log({entityType});

    // Validation des données d'entrée
    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid request. Please provide email and password.' });
    }

    try {
        // Récupération de l'utilisateur par e-mail
        const user = await getUserByEmail(email, entityType);

        if (!user) {
            return res.status(400).json({ error: 'Authentication failed. Please check your email and password and try again' });
        }

        if (token && !user.accountVerified) {
            if (!user.Token || !user.TokenExpiresAt || user.TokenExpiresAt < new Date(Date.now())) {
                const newToken = await generateToken();
                const newSecurePassword = generateSecurePassword(12);

                await updateUser({
                    where: { id: user.id },
                    data: {
                        Token: newToken,
                        TokenExpiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)),//15min :date d'expiration
                    }
                }, entityType);
                // Appeler la fonction sendOTPByEmail avec les paramètres requis
                await sendPasswordByEmail(email, newToken, newSecurePassword, entityType);
                return res.status(400).json({ error: 'expired reset token we will request you a new url for sign in ,please check your email' });

            }
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ error: 'Authentication failed. Please check your email and password and try again' });
            }

            await updateUser({
                where: { id: user.id },
                data: {
                    accountVerified:true,
                    Token: null,
                    TokenExpiresAt: null
                }
            }, entityType);
        }
        else {
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ error: 'Authentication failed. Please check your email and password and try again' });
            }
            // Vérification si le compte de l'utilisateur est vérifié
            if (!user.accountVerified) {
                return res.status(401).json({ error: 'Account not verified' });
            }
        }


        // Génération du jeton d'authentification JWT
        let accessToken
        if (entityType === 'company') {
            accessToken = jwt.sign(
                {

                    user: {
                        user: "company",
                        companyId: user.id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "24h" }
            );
        }
        else if (entityType === 'employee') {
            accessToken = jwt.sign(
                {
                    user: {
                        user: "employee",
                        employeeId: user.id,
                        companyId: user.companyId,
                        role: user.role,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "24h" }
            );
        }


        // Envoi du jeton d'authentification
        return res.status(200).json({ accessToken, user });
    } catch (error) {
        // Gestion des erreurs
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Error logging in.' });
    }
});

const getUserByEmail = async (email, entityType) => {
    try {
        const user = await prisma[entityType].findUnique({
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

const createUser = async (userData, entityType) => {
    try {
        console.log("creating user exec", entityType, userData);
        const newUser = await prisma[entityType].create({
            data: userData
        });
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

const updateUser = async (updateData, entityType) => {
    try {
        const updatedUser = await prisma[entityType].update(updateData);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}



const getEmployeeByEmail = async (email) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: {
                email: email
            }
        });
        return employee;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}
const getCompanyName = async (req, res) => {

    try {
        // Récupérer les infrastructures associées aux projets de l'entreprise
        const AllCompany = await prisma.company.findMany({
            select: {
                id: true,
                companyname: true
            }
        });


        res.status(200).json({ message: 'recupereation avec succes des companies ', AllCompany });

    } catch (error) {
        console.error('Erreur lors de la récupération des companies :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
module.exports = { generateToken, generateSecurePassword, sendPasswordByEmail, login, registerUser, verifyOTP, resetPassword, forgotPassword, sendOTPByEmail, resendOTPByEmail, getCompanyName, getUserByEmail, createUser };
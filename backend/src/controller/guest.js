const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addCompanyOwnerToGuest = async (req, res) => {
    const accountId  = req.params.id;
    const companyId = req.user.id;  

    try {
        const {id,createdAt,...accountCompanyUser} = await prisma.accountCompany.findUnique({
            where: {
                id: parseInt(accountId),
            },
        });

        if (!accountCompanyUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingGuest = await prisma.guest.findUnique({
            where: {
                email: accountCompanyUser.email,
            },
        });

        if (existingGuest) {
            return res.status(409).json({ message: 'User already exists as a guest' });
        }

        const newGuest = await prisma.guest.create({
            data: {
                ...accountCompanyUser, 
                account: {  
                    connect: {
                        id: companyId
                    }
                }
            }
        });
        res.status(201).json(newGuest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error adding guest' });
    }
}

const addGuestToCompany = async (req, res) => {
    const requestData = req.body;
    const companyId = req.user.id;  

    try {
        const newGuest = await prisma.guest.create({
            data: {
                ...requestData, 
                account: {  
                    connect: {
                        id: companyId
                    }
                }
            }
        });
        res.status(201).json(newGuest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error adding guest' });
    }
}
const deleteGuest = async (req, res) => {
    const guestId = req.params.id;
    try {
        const deletedGuest = await prisma.guest.delete({
            where: {
                id: parseInt(guestId)
            }
        });
        res.status(200).json(deletedGuest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting guest' });
    }
}

module.exports = {addGuestToCompany, deleteGuest, addCompanyOwnerToGuest}
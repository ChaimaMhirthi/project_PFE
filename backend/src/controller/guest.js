const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const addGuestToCompany = async (req, res) => {
    const requestData = req.body;
    const companyId = req.user.id;  // Assuming req.user.id contains the id of the company

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

module.exports = {addGuestToCompany, deleteGuest}
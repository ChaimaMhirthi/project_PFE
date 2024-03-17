const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const createProject = async (req, res) => {
    const requestData = req.body;
    const companyId = req.user.id;  // Assuming req.user.id contains the id of the company

    try {
        const newProject = await prisma.project.create({
            data: {
                ...requestData, 
                account: {  
                    connect: {
                        id: companyId
                    }
                }
            }
        });
        res.status(201).json(newProject);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating project' });
    }
}


module.exports = {createProject}
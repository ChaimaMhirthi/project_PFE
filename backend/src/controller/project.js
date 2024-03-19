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
      
const getProjects = async (req,res) => {
    const accountId = req.user.id; 
    try {
        const projects = await prisma.project.findMany({
            where: {
                accountId: accountId
            }
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error getting projects' });
    }
}

const updateProject = async (req, res) => {
    const projectId = req.params.id;
    const requestData = req.body;
    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(projectId) 
            },
            data: {
                ...requestData
            }
        });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating project' });
    }
}

const deleteProject = async (req, res) => {
    const projectId = req.params.id;
    console.log(projectId)
    try {
        const deletedProject = await prisma.project.delete({
            where: {
                id: parseInt(projectId)
            }
        });
        res.status(200).json({message: 'Project deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting project' });
    }
}
module.exports = {createProject, updateProject, getProjects, deleteProject};


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {createResourceForProject} = require('../controller/resource')



      
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

const addResource = async (req, res) => {
    const projectId = req.params.id;
    const mimetype = req.file.mimetype;
    const type= mimetype.split("/")[1];
    const path = req.file.filename;
    const requestData = {type: type , path: path}
    try {
        const projectFound = await prisma.project.findUnique({
            where: {
                id: parseInt(projectId)
            }
        });
        if (!projectFound) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const newResource = await createResourceForProject(projectId,requestData);
        res.status(201).json(newResource);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating resource' });
    }
}

//******************************************* */
// Fonction pour créer une nouvelle infrastructure
async function createNewInfrastructure(formInfrastructure, infrastructureImage) {
    try {
        const newInfrastructure = await prisma.infrastructure.create({
            data: {
                ...formInfrastructure,
                constructionDate: new Date(formInfrastructure.constructionDate),
                span: parseInt(formInfrastructure.span, 10),
                length: parseInt(formInfrastructure.length, 10),
                image: infrastructureImage?.originalname
            }
        });
        return newInfrastructure.id;
    } catch (error) {
        throw new Error("Erreur lors de la création de l'infrastructure :", error);
    }
}
// Fonction pour metre a jour une infrasructure 
async function updateExistingInfrastructure(projectId,formInfrastructure, infrastructureImage) {
    try {
        const project = await prisma.project.findUnique({
            where: {
              id: projectId,
            },
            include: {
              infrastructure: true,
            },
          });
        const newInfrastructure = await prisma.infrastructure.update({
            where: {
                id: project.infrastructure.id,
            },
            data: {
                ...formInfrastructure,
                constructionDate: new Date(formInfrastructure.constructionDate),
                span: parseInt(formInfrastructure.span, 10),
                length: parseInt(formInfrastructure.length, 10),
                image: infrastructureImage?.originalname
            }
        });
        return newInfrastructure.id;
    } catch (error) {
        throw new Error("Erreur lors de la mise a jour de l'infrastructure :", error);
    }
}
// Fonction pour créer un nouveau projet d'inspection

async function createNewProject(formProject, formInfrastructure, infrastructureImage, companyId, guestId) {
    try {
        let infrId;

        if (formInfrastructure.id) {
            // Infrastructure existante
            infrId = formInfrastructure.id;
        } else {
            // Nouvelle infrastructure
            infrId = await createNewInfrastructure(formInfrastructure, infrastructureImage);
        }

        // Créer un nouveau projet
        return await prisma.project.create({
            data: {
                name: formProject.name,
                description: formProject.description,
                companyId: companyId,
                creatorId: guestId | companyId,
                infrastructureId: infrId,
            },
        });
    } catch (error) {
        throw new Error("Erreur lors de la création du projet :", error);
    }
}

// Fonction pour mettre à jour un projet d'inspection existant
async function updateExistingProject(formProject, formInfrastructure, infrastructureImage, companyId, guestId) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: formProject.id },
            include: { infrastructure: true },
        });

        let infrId;
        if (formInfrastructure.id) {
            // Infrastructure existante
            infrId = formInfrastructure.id;
        } else {
            // Nouvelle infrastructure
            infrId = await updateExistingInfrastructure(formProject.id,formInfrastructure, infrastructureImage);
        }

        // Mettre à jour le projet existant
        return await prisma.project.update({
            where: { id: formProject.id },
            data: {
                name: formProject.name,
                description: formProject.description,
                companyId: companyId,
                creatorId: guestId | companyId,
                infrastructureId: infrId,
            },
        });
    } catch (error) {
        throw new Error("Erreur lors de la mise à jour du projet :", error);
    }
}

// Fonction pour gérer la création des ressources à partir des fichiers d'inspection
async function createInspectionResources(inspectionFiles, projectId) {
    try {
        if (!inspectionFiles || inspectionFiles.length === 0) return;

        return Promise.all(inspectionFiles.map(async file => {
            const existingResource = await prisma.resource.findFirst({
                where: {
                    name: file.originalname,
                    projectId: projectId
                }
            });

            if (!existingResource) {
                return prisma.resource.create({
                    data: {
                        type: file.mimetype,
                        name: file.originalname,
                        path: file.path,
                        projectId: projectId
                    }
                });
            }
        }));
    } catch (error) {
        throw new Error("Erreur lors de la création des ressources : " + error.message);
    }
}
const createProject = async (req, res) => {
    const inspectionFiles = req.files.filter(file => file.fieldname === 'inspectionFile');
    const infrastructureImage = req.files.find(file => file.fieldname === 'infrastructureImage');
    const formProject = JSON.parse(req.body.project);
    const formInfrastructure = JSON.parse(req.body.infrastructure);
    const { companyId, guestId } = req.user;

    try {
        let updatedProject;

        if (!formProject.id) {
            updatedProject = await createNewProject(formProject, formInfrastructure, infrastructureImage, companyId, guestId);
        } else {
            updatedProject = await updateExistingProject(formProject, formInfrastructure, infrastructureImage, companyId, guestId);
        }

        // Créer les ressources d'inspection
        if (inspectionFiles && inspectionFiles.length > 0) {
            await createInspectionResources(inspectionFiles, updatedProject.id);
        }

        res.status(200).json({ message: 'Projet créé ou mis à jour avec succès', projectId: updatedProject.id });
    } catch (error) {
        console.error("Erreur lors de la création ou de la mise à jour du projet :", error);
        res.status(500).json({ error: 'Erreur lors de la création ou de la mise à jour du projet' });
    }
}


module.exports = {createProject, updateProject, getProjects, deleteProject,addResource};



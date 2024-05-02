const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const { updateExistingInfrastructure ,createNewInfrastructure} = require('../controller/infrastructure');

// const { createResourceForProject } = require('./inspectionResource')

const getMultiFormStepData = async (req, res) => {
    const { projectId } = req.params;
    try {
        const projects = await prisma.project.findMany({
            where: {
                id: parseInt(projectId)
            },
            include: { infrastructure: true, resources: true },

        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error getting projects' });
    }
}

const getProjects = async (req, res) => {
    const { companyId } = req.user;
    try {
        const projects = await prisma.project.findMany({
            where: {
                companyId: companyId
            },
            include: { infrastructure: true, company: true },

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
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting project' });
    }
}

// const addResource = async (req, res) => {
//     const projectId = req.params.id;
//     const mimetype = req.file.mimetype;
//     const type = mimetype.split("/")[1];
//     const path = req.file.filename;
//     const requestData = { type: type, path: path }
//     try {
//         const projectFound = await prisma.project.findUnique({
//             where: {
//                 id: parseInt(projectId)
//             }
//         });
//         if (!projectFound) {
//             return res.status(404).json({ message: 'Project not found' });
//         }
//         const newResource = await createResourceForProject(projectId, requestData);
//         res.status(201).json(newResource);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Error creating resource' });
//     }
// }

//******************************************* */
// Fonction pour créer une nouvelle infrastructure

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
            infrId = await updateExistingInfrastructure(formProject.id, formInfrastructure, infrastructureImage);
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

const start_process = async (req, res) => {
    const { companyId } = req.user;
    const { projectId } = req.body;
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                resources: {
                    select: { name: true, id: true }
                }
            },
        });

        if (!project) {
            return res.status(200).json({ message: 'Le projet avec l\'ID donné n\'existe pas.' });
        }


        // Créer un objet où chaque nom de ressource est une valeur associée à une clé unique
        const namedResources = {};
        project.resources.forEach(resource => {
            namedResources[resource.id] = resource.name;
        });
        console.log(namedResources)
        // Envoyer une réponse JSON avec les noms de ressources associés à des clés uniques
        const respons = await axios.post('http://127.0.0.1:5000/process_media', { media_list: namedResources });
        const resultProcessing = respons.data
        for (const damageData of Object.values(resultProcessing)) {
            console.log("damageId: avant format  " + typeof (damageData.resourceId))
            var resourceId = parseInt(damageData.resourceId);
            console.log("damageId: apres format" + typeof (resourceId))

            await prisma.damage.create({
                data: {
                    type: damageData.type,
                    videoFrameNumber: damageData.videoFrameNumber,
                    DetectResultImage: damageData.DetectResultImage,
                    croppedDamageImage: damageData.croppedDamageImage,
                    confidence: damageData.confidence,
                    trackingVideoId: damageData.trackingVideoId,
                    resourceId: parseInt(damageData.resourceId) // Utilisation de l'ID de la ressource
                }
            });
        }
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId
            },
            data: {

                status: true,
            }
        });
        return res.status(200).json({ message: 'Le traitement est finie en succes' });
    }
    catch (error) {
        if (error.response && error.response.data) {
            console.error("Erreur est srvenue lors du  traitement des donnes avec flask :", error.response.data.error);
            return res.status(500).json({ error: error.response.data });
        } else {
            console.error("Erreur est srvenue lors du  traitement des donnes :", error);
            return res.status(500).json({ error: 'Erreur est srvenue lors du  traitement des donnes' });
        }
    }

}


module.exports = { createProject, updateProject, getProjects, deleteProject, start_process,getMultiFormStepData , createNewInfrastructure};



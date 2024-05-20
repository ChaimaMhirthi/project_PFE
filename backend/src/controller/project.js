const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const { updateExistingInfrastructure, createNewInfrastructure } = require('../controller/infrastructure');

// const { createResourceForProject } = require('./inspectionResource')
const getAllEmployee = async (req, res) => {
    const { managerId } = req.user;

    try {
        // Récupérer les infrastructures associées aux projets de l'entreprise
        const AllEmployee = await prisma.employee.findMany({
            where: {
                managerId: managerId,

            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                role: true
            }
        });


        res.status(200).json({ message: 'recupereation avec succes des employee ', AllEmployee });

    } catch (error) {
        console.error('Erreur lors de la récupération des employee :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
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
    const { managerId, employeeId } = req.user;
    try {
        let projects;
        if (employeeId) {
            console.log("getProjects", employeeId);

            const employeeProjectAssignments = await prisma.employeeProjectAssignment.findMany({
                where: {
                    employeeId: employeeId
                },
                include: {
                    project: {
                        include: { infrastructure: true, manager: true }
                    }
                }
            });
            projects = employeeProjectAssignments.map(assignment => assignment.project);
            console.log("project assig employee", projects);
        }
        else if (managerId) {
            // Si managerId est défini, récupérer les projets associés à cet ID
            projects = await prisma.project.findMany({
                where: {
                    managerId: managerId
                },
                include: { infrastructure: true, manager: true },
            });
        }
        else {
            // Si managerId n'est pas défini, récupérer tous les projets
            projects = await prisma.project.findMany({
                include: { infrastructure: true, manager: true },
            });
        }

        if (!projects || projects.length === 0) {
            // Si aucun projet n'a été récupéré, retourner une réponse avec un code de statut 404 (Not Found)
            return res.status(404).json({ error: 'Aucun projet trouvé' });
        }

        res.status(200).json(projects);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
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

async function createNewProject(formProject, formInfrastructure, infrastructureImage, managerId, guestId) {
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
                managerId: managerId,
                creatorId: guestId | managerId,
                infrastructureId: infrId,
            },
        });
    } catch (error) {
        throw new Error("Erreur lors de la création du projet :", error);
    }
}

// Fonction pour mettre à jour un projet d'inspection existant
async function updateExistingProject(formProject, formInfrastructure, infrastructureImage, managerId, guestId) {
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
                managerId: managerId,
                creatorId: guestId | managerId,
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
                    name: file.fieldname,
                    type: file.mimetype,
                    projectId: projectId
                }
            });

            if (!existingResource) {
                return prisma.resource.create({
                    data: {
                        type: file.mimetype,
                        name: file.fieldname,
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
    const { projectForm, infrastructureID, employeeAssignment } = req.body;
    const ids = [
        ...(employeeAssignment.expertId || []),
        ...(employeeAssignment.inspectorId || []),
        ...(employeeAssignment.guestsId || [])
    ];
    console.log({ ids });
    console.log({ employeeAssignment });

    const { managerId, employeeId, role } = req.user;
    console.log({ managerId, employeeId, role });

    try {
        // Vérifier si le nom de projet est unique
        const existingProject = await prisma.project.findUnique({
            where: {
                name: projectForm.name
            }
        });

        if (existingProject) {
            // Si un projet avec le même nom existe déjà, renvoyer une erreur
            return res.status(400).json({ error: "A project with this name already exists" });
        }
        if (!employeeAssignment.expertId || !employeeAssignment.inspectorId) {
            // Si un projet avec le même nom existe déjà, renvoyer une erreur
            return res.status(400).json({ error: "you must specify  your team" });
        }

        // Créer le projet
        const assignproject = await prisma.project.create({
            data: {
                name: projectForm.name,
                description: projectForm.description,
                startdate: projectForm.startdate ? new Date(projectForm.startdate) : null,
                enddate: projectForm.enddate ? new Date(projectForm.enddate) : null,
                infrastructureId: infrastructureID,
                creatorId: employeeId || managerId,
                managerId: managerId,

                employee: {
                    create: ids.map(employeeId => ({
                        employee: { connect: { id: employeeId } }
                    }))
                }
            }
        });

        res.status(200).json({ message: 'Project created successfully', assignproject });
    } catch (error) {
        console.error("Erreur lors de la création du projet :", error);
        res.status(500).json({ error: "An error occurred while creating the project" });
    }
};


const start_process = async (req, res) => {
    const { managerId } = req.user;
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

                status: 2,
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

const addRessources = async (req, res) => {
    const { projectId } = req.body;
    const resources = req.files;
    console.log({ resources });
    console.log({ projectId });
    const { managerId, employeeId, role } = req.user;
    console.log({ managerId, employeeId, role });
    try {
        const projectIdInt = parseInt(projectId, 10);
        // Utilisez await avec createInspectionResources car c'est une fonction asynchrone
        await createInspectionResources(resources, projectIdInt);
        // Envoyez une réponse une fois que la création des ressources est terminée
        res.status(200).json({ message: 'Ressources ajoutées avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'ajout des ressources' });
    }
}
const checkData = async (req, res) => {
    console.log('checkData')
    const { projectId } = req.body;
    console.log('projectId', { projectId });
    const { managerId, employeeId, role } = req.user;
    console.log('checkData', { managerId, employeeId, role });

    try {

        // Vérifier si le projet existe
        const project = await prisma.project.findUnique({
            where: {
                id: parseInt(projectId),
            },
        });

        if (!project) {
            return res.status(404).json({ error: 'Projet not found' });
        }

        // Vérifier s'il existe au moins un média de type 'image/' ou 'video/' associé au projet
        const hasImageMedia = await prisma.resource.findFirst({
            where: {
                projectId: project.id,
                type: {
                    startsWith: 'image/',
                },
            },
        });

        // Vérifier s'il existe au moins un média de type 'video/' associé au projet
        const hasVideoMedia = await prisma.resource.findFirst({
            where: {
                projectId: project.id,
                type: {
                    startsWith: 'video/',
                },
            },
        });

        if (!hasImageMedia && !hasVideoMedia) {
            return res.status(404).json({ error: 'Aucun média de type image ou vidéo associé à ce projet' });
        }
        // Envoyez une réponse une fois que la vérification est terminée
        res.status(200).json({ message: 'Le projet et les médias existent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la vérification' });
    }
};

const ConfirmResource = async (req, res) => {

    const { projectId } = req.body;

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: parseInt(projectId)
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project instance not found' });
        }


        await prisma.project.update({
            where: {
                id: parseInt(projectId)
            },
            data: {
                status: 1
            }
        });


        res.status(200).json({ message: 'Project instance found and updated successfully' });
    } catch (error) {
        console.error('Error processing project request:', error);
        res.status(500).json({ error: 'An error occurred while processing project request' });
    }

}
module.exports = { createProject, updateProject, getProjects, deleteProject, start_process, getMultiFormStepData, createNewInfrastructure, getAllEmployee, addRessources, checkData, ConfirmResource };



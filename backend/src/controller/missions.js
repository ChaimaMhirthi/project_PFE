const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// Contrôleur pour créer une nouvelle mission
const createMission = async (req, res) => {
    const { title, description, assigneeId } = req.body;
    const { employeeId, managerId, role ,user} = req.user
    if (!managerId && (!employeeId || role !== 3)) {
        return res.status(401).json({ error: "only admin or projectManager can create missions" });

    }
    // Vérification des champs obligatoires 
    if (!assigneeId) {
        return res.status(422).json({ error: "Project Manager ID is required" });
    }

    if (!title) {
        return res.status(422).json({ error: "Title is required" });
    }
    if (!description) {
        return res.status(422).json({ error: "Description is required" });
    }

    try {
        // Créer une nouvelle mission dans la base de données
        const newMission = await prisma.mission.create({
            data: {
                title,
                description,
                employeeId: assigneeId,
                creatorId: managerId || employeeId,
                creatorType :user
            },

        });

        res.status(201).json({ message: "mission created succcessefuly" });
    } catch (error) {
        console.error("Error creating mission:", error);
        res.status(500).json({ error: "An error occurred while creating the mission. Please try again later." });
    }
};
const getAllMissions = async (req, res) => {
    const {  managerId, employeeId, role } = req.user;
    let missions;
    try {
        console.log("getAllMissions managerId", managerId);
        if (employeeId && role === 3) {

            missions = await prisma.employee.findMany({
                where: {
                    managerId: managerId,
                },
                select: {
                    firstname: true,
                    lastname: true,
                    mission: {
                        where:{
                            creatorId:employeeId,
                            creatorType: "employee" // Filtrer par creatorType
                        }
                    },
                },
            });
        }
        else if (managerId) {
            missions = await prisma.employee.findMany({
                where: {
                    managerId: managerId,

                },
                select: {
                    firstname: true,
                    lastname: true,
                    mission: {},
                },
            });
        }

        // Récupérer toutes les missions associées à l'ID du manager

        console.log("missions", missions);
        res.status(200).json(missions);
    } catch (error) {
        console.error("Error fetching missions:", error);
        res.status(500).json({ error: "An error occurred while fetching the missions. Please try again later." });
    }
};

const getMyMissions = async (req, res) => {
    const { employeeId } = req.user;
    let missions;
    try {

        if (employeeId) {
            missions = await prisma.mission.findMany({
                where: {
                    employeeId: employeeId,

                },
                select: {
                    id:true,
                    status: true,
                    description: true,
                    title: true,
                    createdAt: true,
                },
            });
        }
        // Récupérer toutes les missions associées à l'ID du manager

        console.log("missions", missions);
        res.status(200).json(missions);
    } catch (error) {
        console.error("Error fetching missions:", error);
        res.status(500).json({ error: "An error occurred while fetching the missions. Please try again later." });
    }
};



// Contrôleur pour mettre à jour une mission
const updateMission = async (req, res) => {
    const { missionId } = req.params;
    const { status } = req.body;
    const { employeeId, managerId } = req.user;

    try {
        // Trouver la mission dans la base de données
        const mission = await prisma.mission.findUnique({
            where: {
                id: parseInt(missionId),
            },
        });

        // Vérifier si la mission existe
        if (!mission) {
            return res.status(404).json({ error: "Mission not found" });
        }

        const creatorId = mission.creatorId;
        const assigneeId = mission.employeeId;

        // Vérifier si l'utilisateur a les permissions pour mettre à jour la mission
        const isAuthorized = (employeeId && (employeeId === creatorId || employeeId === assigneeId)) ||
            (managerId && (managerId === creatorId));

        if (!isAuthorized) {
            return res.status(403).json({ error: "You do not have permission to update this mission" });
        }

        // Mettre à jour la mission dans la base de données
        await prisma.mission.update({
            where: {
                id: parseInt(missionId),
            },
            data: {
                status,
            },
        });

        res.status(200).json({ message: "Mission updated successfully" });
    } catch (error) {
        console.error("Error updating mission:", error);
        res.status(500).json({ error: "An error occurred while updating the mission. Please try again later." });
    }
};


// Contrôleur pour supprimer une mission
const deleteMission = async (req, res) => {
    const { missionId } = req.params;
    const { employeeId, managerId } = req.user;
    console.log('mission id',missionId);

    try {
        const mission = await prisma.mission.findUnique({
            where: {
                id: parseInt(missionId),
            },
        });

        // Vérifier si la mission existe
        if (!mission) {
            return res.status(404).json({ error: "Mission not found" });
        }

        const creatorId = mission.creatorId;

        // Vérifier si l'utilisateur a les permissions pour mettre à jour la mission
        const isAuthorized = (employeeId && employeeId === creatorId) || (managerId && (managerId === creatorId));

        if (!isAuthorized) {
            return res.status(403).json({ error: "You do not have permission to delete this mission" });
        }
        // Supprimer la mission de la base de données
        await prisma.mission.delete({
            where: {
                id: parseInt(missionId),
            },
        });

        res.status(200).json({ message: "Mission deleted successfully" });
    } catch (error) {
        console.error("Error deleting mission:", error);
        res.status(500).json({ error: "An error occurred while deleting the mission. Please try again later." });
    }
};

module.exports = { createMission, getAllMissions, updateMission, deleteMission, getMyMissions };
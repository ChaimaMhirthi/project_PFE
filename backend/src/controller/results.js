const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getResultByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {
        const damages = await prisma.damage.findMany({
            where: {
                resource: {
                    projectId: parseInt(projectId),
                },
            },
            include: {
                resource: {
                    select: {
                        id: true,
                        name: true,
                        type : true,
                    },
                },
            },
        });

        res.json(damages);
    } catch (error) {
        console.error('Erreur lors de la récupération des dommages :', error);
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
};


module.exports = { getResultByProjectId };
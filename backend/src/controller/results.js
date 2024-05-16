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
                        type: true,
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
const updateDamage = async (req, res) => {
    const { editedRow } = req.body;
    try {
        // Iterate through all damages to update

        const { id: damageId, comment, dangerDegree } = editedRow;

        // Check if the damage exists and belongs to the given project
        const existingDamage = await prisma.damage.findUnique({
            where: {
                id: parseInt(damageId),
            }
        });

        if (!existingDamage) {
            return res.status(404).json({ error: `The damage with ID ${damageId} does not exist or does not belong to the specified project.` });
        }

        // Update damage information
        const updatedDamage = await prisma.damage.update({
            where: {
                id: parseInt(damageId),
            },
            data: {
                dangerDegree,
                comment
            }
        });

        res.status(200).json({ message: 'Success', damageId });

    } catch (error) {
        console.error('Error updating damages:', error);
        res.status(500).json({ error: 'An error occurred while updating damages' });
    }
};

const deleteDamage = async (req, res) => {
    const { damageId } = req.params;
    try {
        // Vérifiez si le dommage existe
        const existingDamage = await prisma.damage.findUnique({
            where: {
                id: parseInt(damageId),
            }
        });

        if (!existingDamage) {
            return res.status(404).json({ error: `The damage with ID ${damageId} does not exist or does not belong to the specified project.` });
        }

        // Supprimez le dommage
        await prisma.damage.delete({
            where: {
                id: parseInt(damageId),
            }
        });

        res.status(200).json({ message: 'Damage removed successfully' });

    } catch (error) {
        console.error('Error deleting damage:', error);
        res.status(500).json({ error: 'An error occurred while deleting damage' });
    }
};

module.exports = { getResultByProjectId, updateDamage, deleteDamage };
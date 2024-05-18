const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInspectionResource = async (req, res) => {
    const { projectId } = req.body;

    const Resource = await prisma.resource.findMany({
        where: {
            id: projectId, // Utilisez `managerId` comme critère de recherche
          },
          select: {
            infrastructure: {
              select: {
                id: true,
                name: true,
              },
            },
          },
    });
    return newResource;
}


module.exports = { getInspectionResource }
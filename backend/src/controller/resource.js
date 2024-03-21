const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();





const createResourceForProject = async (projectId,requestData) =>{
    console.log(projectId);
   const newResource = await prisma.resource.create({
        data: {
            ...requestData,
            project: {
                connect: {
                    id: parseInt(projectId)
                }
            }
        }
    });
    return newResource;
}


module.exports = { createResourceForProject }
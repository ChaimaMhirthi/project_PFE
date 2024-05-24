const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDataStatistics = async (req, res) => {
    const { employeeId, managerId, superAdminId } = req.user;
    let projectCount = 0;
    let employeeCount = 0;
    let companyCount = 0;
    let formattedStats;
    try {
        if (employeeId) {
            projectCount = await prisma.employeeProjectAssignment.count({
                where: {
                    employeeId: employeeId
                }
            });
          
        }
        if (managerId) {
            projectCount = await prisma.project.count({
                where: {
                    managerId: managerId
                }
            });
            // Récupérer le nombre d'employés associés au manager
            employeeCount = await prisma.employee.count({
                where: {
                    managerId: managerId
                }
            });
        }
        else if (superAdminId) {
            projectCount = await prisma.project.count();

            // Récupérer le nombre total d'employés
            employeeCount = await prisma.employee.count();

            // Récupérer le nombre total de sociétés
            companyCount = await prisma.manager.count();

            // const stats = await prisma.manager.groupBy({
            //     by: ['createdAt'],
            //     _count: {
            //       id: true,
            //     },
            //     orderBy: {
            //       createdAt: 'asc',
            //     },
            //   });
            //       console.log("stats",{stats});

            //    formattedStats = stats.map(stat => ({
            //     date: stat.createdAt.toISOString().split('T')[0],
            //     userCount: stat._count.id,
            //   }));
          
        }

        console.log("formattedStats",{formattedStats});
        res.status(200).json({ projectCount, employeeCount, companyCount  });

    } catch (error) {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}


module.exports = { getDataStatistics };
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInfrastructures = async (req, res) => {
  const companyId = req.user.id; // ID de l'utilisateur associé à l'entreprise

  try {
    // Récupérer les infrastructures associées aux projets de l'entreprise
    const projects = await prisma.project.findMany({
      where: {
        accountId: companyId, // Utilisez `companyId` comme critère de recherche
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

    // Utiliser un objet pour stocker les infrastructures uniques par ID
    const uniqueInfrastructures = {};

    projects.forEach((project) => {
      const infra = project.infrastructure; // Traitement comme un objet unique
      if (infra && !uniqueInfrastructures[infra.id]) {
        uniqueInfrastructures[infra.id] = infra; // Ajout de l'infrastructure si l'ID n'existe pas déjà
      }
    });

    // Convertir l'objet en tableau pour obtenir des valeurs uniques
    const infrastructureArray = Object.values(uniqueInfrastructures);
    
    res.json(infrastructureArray); // Retourner les infrastructures uniques
  } catch (error) {
    console.error('Erreur lors de la récupération des infrastructures :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { getInfrastructures };

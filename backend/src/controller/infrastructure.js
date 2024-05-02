const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();





const createNewInfrastructure = async (req, res) => {
    const InfrastructureForm = req.body;
    const infrastructureImage = req.files;
    const { companyId } = req.user;
    try  { 
        // Valider les données du formulaire
        if (!InfrastructureForm.name || !InfrastructureForm.type) {
            return res.status(400).json({ message: 'Veuillez fournir le nom et le type de l\'infrastructure' });
        }
        const existingInfrastructure = await prisma.infrastructure.findFirst({
          where: {
              name: InfrastructureForm.name
          }
      });

      if (existingInfrastructure) {
          return res.status(400).json({ message: 'Une infrastructure avec ce nom existe déjà' });
      }
        // Créer une nouvelle infrastructure dans la base de données
        const newInfrastructure = await prisma.infrastructure.create({
            data: {
                ...InfrastructureForm,
                constructionDate: InfrastructureForm.constructionDate ? new Date(InfrastructureForm.constructionDate) : null,
                span: InfrastructureForm.span ? parseInt(InfrastructureForm.span, 10) : null,
                length: InfrastructureForm.length ? parseInt(InfrastructureForm.length, 10) : null,
                image: infrastructureImage[0]?.originalname,
                companyId:companyId
            }
        });

        console.log("Nouvelle infrastructure créée :", newInfrastructure);
        res.status(200).json({ message: 'Infrastructure créée avec succès', newInfrastructure });
    } catch (error) {
        console.error("Erreur lors de la création de l'infrastructure :", error);
        // Gérer les erreurs
        if (error.code === 'P2002') {
            // Contrainte de clé unique violée
            return res.status(400).json({ message: 'Une infrastructure avec ce nom existe déjà' });
        } else {
            // Erreur système imprévue
            return res.status(500).json({ message: 'Erreur lors de la création de l\'infrastructure' });
        }
    }
};
// Fonction pour metre a jour une infrasructure 
const updateExistingInfrastructure = async (req, res) => {
  try {
      const infrasId = req.body.infrasId;
      const InfrastructureForm = req.body;
console.log({infrasId, InfrastructureForm});
      // Vérifier si une infrastructure avec le même nom existe déjà (sauf celle que nous mettons à jour)
      const existingInfrastructure = await prisma.infrastructure.findFirst({
          where: {
              name: InfrastructureForm.name,
              NOT: {
                  id: infrasId
              }
          }
      });

      if (existingInfrastructure) {
          return res.status(400).json({ message: 'Une infrastructure avec ce nom existe déjà' });
      }

      // Mettre à jour l'infrastructure dans la base de données
      const InfrastructureUpdated = await prisma.infrastructure.update({
          where: {
              id: infrasId,
          },
          data: {
              ...InfrastructureForm,
              constructionDate: new Date(InfrastructureForm.constructionDate),
              span: parseInt(InfrastructureForm.span, 10),
              length: parseInt(InfrastructureForm.length, 10),
              image: infrastructureImage?.originalname
          }
      });
      res.status(200).json({ message: 'Infrastructure modifiée avec succès', infrasId: InfrastructureUpdated.id });
  } catch (error) {
      console.error("Erreur lors de la mise à jour de l'infrastructure :", error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'infrastructure' });
  }
};

const getInfrastructures = async (req, res) => {
  const { companyId} = req.user;

  try {
    // Récupérer les infrastructures associées aux projets de l'entreprise
    const infrastructure = await prisma.infrastructure.findMany({
      where: {
        id: companyId, // Utilisez `companyId` comme critère de recherche
      },
    });


    
    res.json(infrastructure); // Retourner les infrastructures uniques
  } catch (error) {
    console.error('Erreur lors de la récupération des infrastructures :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { getInfrastructures,updateExistingInfrastructure , createNewInfrastructure};

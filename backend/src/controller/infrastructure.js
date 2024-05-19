const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const deleteInfrastructure = async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier si l'infrastructure existe
    const infrastructureToDelete = await prisma.infrastructure.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!infrastructureToDelete) {
      return res.status(404).json({ message: 'Infrastructure non trouvée' });
    }

    // Supprimer l'infrastructure
    await prisma.infrastructure.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: 'Infrastructure supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'infrastructure :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'infrastructure' });
  }
};
const createNewInfrastructure = async (req, res) => {
  const InfrastructureForm = req.body;
  console.log("InfrastructureForm",InfrastructureForm);
  const infrastructureImage = req.files;
  const { managerId } = req.user;
  console.log("createNewInfrastructure ", InfrastructureForm);
  try {
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
        managerId: managerId
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
    const InfrastructureForm = req.body;
    const infrastructureImage = req.files;
    const infrastrId = req.body.infrastrId;

    console.log('infrastrId:', infrastrId);
    console.log('infrastructureImage:', infrastructureImage);

    console.log('formData:', InfrastructureForm);


    // Vérifier si une infrastructure avec le même nom existe déjà (sauf celle que nous mettons à jour)
    const existingInfrastructure = await prisma.infrastructure.findFirst({
        where: {
            name: InfrastructureForm.name,
            NOT: {
                id: parseInt(infrastrId)
            }
        }
    });

    if (existingInfrastructure) {
        return res.status(400).json({ message: 'Une infrastructure avec ce nom existe déjà' });
    }
 
    // Mettre à jour l'infrastructure dans la base de données
    const InfrastructureUpdated = await prisma.infrastructure.update({
      where: {
        id: parseInt(infrastrId),
      },
      data: {
        managerId:  parseInt(InfrastructureForm.managerId),
        constructionDate: new Date(InfrastructureForm.constructionDate),
        span: parseInt(InfrastructureForm.span),
        length: parseInt(InfrastructureForm.length),
        image: infrastructureImage[0]?.originalname || InfrastructureForm.image,
        title: InfrastructureForm.title,
        name: InfrastructureForm.name,
        description: InfrastructureForm.description,
        country: InfrastructureForm.country,
        locationAddress: InfrastructureForm.locationAddress
      }
    });
    res.status(200).json({ message: 'Infrastructure modifiée avec succès', infrastrId: InfrastructureUpdated.id });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'infrastructure :", error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'infrastructure' });
  }
};

const getAllInfrastructures = async (req, res) => {


  const { managerId, superAdminId } = req.user;
  try {
    let infrastructures;
    if (superAdminId!==undefined && superAdminId) {
      // Si superAdminId est défini, récupérer toutes les infrastructures
      infrastructures = await prisma.infrastructure.findMany();
    } else if (managerId) {
      // Si managerId est défini, récupérer les infrastructures associées à cet ID
      infrastructures = await prisma.infrastructure.findMany({
        where: {
          managerId: managerId,
        },
      });
    } 

    if (!infrastructures || infrastructures?.length === 0) {
      // Si aucune infrastructure n'a été récupérée, retourner une réponse avec un code de statut 404 (Not Found)
      return res.status(404).json({ error: 'Aucune infrastructure trouvée' });
    }

    res.status(200).json({ message: 'Récupération réussie des infrastructures', infrastructures: infrastructures });

  } catch (error) {
    console.error('Erreur lors de la récupération des infrastructures :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};


const getInfrastructure = async (req, res) => {
  const { id } = req.params;


  try {
    // Récupérer les infrastructures associées aux projets de l'entreprise
    const infrastructure = await prisma.infrastructure.findUnique({
      where: {
        id: parseInt(id),
      },
    });


    res.status(200).json({ message: 'recupereation avec succes de linfrastructures ', infrastructure: infrastructure });

  } catch (error) {
    console.error('Erreur lors de la récupération des infrastructures :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
module.exports = { getAllInfrastructures,deleteInfrastructure, getInfrastructure, updateExistingInfrastructure, createNewInfrastructure };

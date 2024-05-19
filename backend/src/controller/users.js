const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createUser, getUserByEmail, sendPasswordByEmail, generateSecurePassword, generateToken } = require('../controller/auth');
const bcrypt = require('bcrypt');


const getAllEmployee = async (req, res) => {
  const { managerId, superAdminId } = req.user;

  try {
    const AllEmployee = await prisma.employee.findMany({
      where: managerId ? { managerId } : superAdminId ? {} : { id: null },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        role: true,
        email: true,
        createdAt: true,
        accountVerified: true,
        status: true,
        profileImage:true,
        manager: {    // Sélectionnez les projets associés à chaque employé
          select: {
            companyname: true
          }
        },
        project: {    // Sélectionnez les projets associés à chaque employé
          select: {
            projectId: true
          }
        }
      }
    });
    res.status(200).json({ message: 'Récupération réussie des employés', AllEmployee });

  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const updateEmployee = async (req, res) => {
  const { editedRow } = req.body;
  try {
    // Iterate through all damages to update

    const { id: employeeId, role, status } = editedRow;

    // Check if the employee exists and belongs to the given project
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        id: parseInt(employeeId),
      }
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: `The employee with ID ${employeeId} does not exist or does not belong ` });
    }

    // Update employee information
    const updatedEmployee = await prisma.employee.update({
      where: {
        id: parseInt(employeeId),
      },
      data: {
        role,
        status
      }
    });

    res.status(200).json({ message: 'Success', updatedEmployee });

  } catch (error) {
    console.error('Error updating damages:', error);
    res.status(500).json({ error: 'An error occurred while updating damages' });
  }
};
const deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;
  console.log("delete employee fct ", employeeId);
  try {
    // Vérifiez si le dommage existe
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        id: parseInt(employeeId),
      }
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: `The employee with ID ${employeeId} does not exist or does not belong ` });
    }

    // Supprimez d'abord les enregistrements dans EmployeeProjectAssignment liés à cet employé
    await prisma.employeeProjectAssignment.deleteMany({
      where: {
        employeeId: parseInt(employeeId),
      },
    });

    await prisma.employee.delete({
      where: {
        id: parseInt(employeeId),
      }
    });

    res.status(200).json({ message: 'employee account removed successfully' });

  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'An error occurred while deleting employee' });
  }
};
const getAllManager = async (req, res) => {

  try {
    const AllManager = await prisma.manager.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
        accountVerified: true,
        status: true,
        companyname: true,
        employee: {
          select: {
            id: true
          }
        },
        projects: {
          select: {
            name: true
          }
        }
      }

    });
    res.status(200).json({ message: 'Récupération réussie des employés', AllManager });

  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const updateManager = async (req, res) => {
  const { editedRow } = req.body;
  try {
    // Iterate through all damages to update

    const { id: managerId, status } = editedRow;

    // Check if the Manager exists and belongs to the given project
    const existingManager = await prisma.manager.findUnique({
      where: {
        id: parseInt(managerId),
      }
    });

    if (!existingManager) {
      return res.status(404).json({ error: `The Manager with ID ${managerId} does not exist or does not belong ` });
    }

    // Update Manager information
    const updatedManager = await prisma.manager.update({
      where: {
        id: parseInt(managerId),
      },
      data: {
        status
      }
    });

    res.status(200).json({ message: 'Success', updatedManager });

  } catch (error) {
    console.error('Error updating damages:', error);
    res.status(500).json({ error: 'An error occurred while updating damages' });
  }
};
const deleteManager = async (req, res) => {
  const { managerId } = req.params;
  console.log("Delete Manager", managerId);
  try {
    // Vérifiez si le dommage existe
    const existingManager = await prisma.manager.findUnique({
      where: {
        id: parseInt(managerId),
      }
    });

    if (!existingManager) {
      return res.status(404).json({ error: `The Manager with ID ${managerId} does not exist or does not belong ` });
    }

    // Supprimez le dommage
    await prisma.manager.delete({
      where: {
        id: parseInt(managerId),
      }
    });

    res.status(200).json({ message: 'Damage removed successfully' });

  } catch (error) {
    console.error('Error deleting Manager:', error);
    res.status(500).json({ error: 'An error occurred while deleting Manager' });
  }
};

const CreateUser = async (req, res, entityType) => {
  try {
    console.log("createEmployee executed ",);
    const profileImage = req.files;
    console.log({profileImage});
    const userData = req.body
    console.log({userData});

    const user = await getUserByEmail(userData.email, entityType);
    if (user) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    //générer un mot de passe de 12 caractères
    const securePassword = generateSecurePassword(12);
    // Création d'un nouveau hash pour le mot de passe
    const hashedPassword = await bcrypt.hash(securePassword, 10);
    const token = await generateToken()
    // Création d'un nouveau user avec Prisma    
    if (userData.companyname)
      {
        const manager = await prisma.manager.findUnique({
          where: {
            companyname: userData.companyname
          }  
      });          
      if (manager) {
        return res.status(400).json({ error: 'company with this name already exist' });
      }
      }
    const newUser = await createUser({
      ...userData,

      managerId: userData.managerId ? parseInt(userData.managerId) : undefined,

      role: userData.role ? parseInt(userData.role) : undefined,
      status: userData.status ? parseInt(userData.status) : undefined,

      password: hashedPassword,
      Token: token,
      TokenExpiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 heures
     
      profileImage: profileImage[0]?.originalname

    }, entityType);

    await sendPasswordByEmail(newUser.email, newUser.Token, securePassword, entityType)
    res.status(200).json({ message: ' user created successfully', });

  } catch (error) {
    console.error('Error deleting Manager:', error);
    res.status(500).json({ error: 'An error occurred while creating user' });
  }
};
module.exports = { getAllManager, updateManager, deleteManager, getAllEmployee, updateEmployee, deleteEmployee, CreateUser };
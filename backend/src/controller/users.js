const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createUser, getUserByEmail, sendPasswordByEmail, generateSecurePassword, generateToken } = require('../controller/auth');
const bcrypt = require('bcrypt');


const getAllEmployee = async (req, res) => {
  const { companyId, superAdminId } = req.user;

  try {
    const AllEmployee = await prisma.employee.findMany({
      where: companyId ? { companyId } : superAdminId ? {} : { id: null },
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
        company: {    // Sélectionnez les projets associés à chaque employé
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
    console.log(AllEmployee);
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
const getAllCompany = async (req, res) => {

  try {
    const AllCompany = await prisma.company.findMany({
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
    console.log("AllCompany", AllCompany);
    res.status(200).json({ message: 'Récupération réussie des employés', AllCompany });

  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const updateCompany = async (req, res) => {
  const { editedRow } = req.body;
  try {
    // Iterate through all damages to update

    const { id: companyId, status } = editedRow;

    // Check if the Company exists and belongs to the given project
    const existingCompany = await prisma.company.findUnique({
      where: {
        id: parseInt(companyId),
      }
    });

    if (!existingCompany) {
      return res.status(404).json({ error: `The Company with ID ${companyId} does not exist or does not belong ` });
    }

    // Update Company information
    const updatedCompany = await prisma.company.update({
      where: {
        id: parseInt(companyId),
      },
      data: {
        status
      }
    });

    res.status(200).json({ message: 'Success', updatedCompany });

  } catch (error) {
    console.error('Error updating damages:', error);
    res.status(500).json({ error: 'An error occurred while updating damages' });
  }
};
const deleteCompany = async (req, res) => {
  const { companyId } = req.params;
  console.log("Delete Company", companyId);
  try {
    // Vérifiez si le dommage existe
    const existingCompany = await prisma.company.findUnique({
      where: {
        id: parseInt(companyId),
      }
    });

    if (!existingCompany) {
      return res.status(404).json({ error: `The Company with ID ${companyId} does not exist or does not belong ` });
    }

    // Supprimez le dommage
    await prisma.company.delete({
      where: {
        id: parseInt(companyId),
      }
    });

    res.status(200).json({ message: 'Damage removed successfully' });

  } catch (error) {
    console.error('Error deleting Company:', error);
    res.status(500).json({ error: 'An error occurred while deleting Company' });
  }
};

const CreateUser = async (req, res, entityType) => {
  try {
    console.log("createEmployee executed ",);
    const profileImage = req.files;
    console.log({profileImage});
    const userData = req.body
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
    const newUser = await createUser({
      ...userData,

      companyId: userData.companyId ? parseInt(userData.companyId) : undefined,
      role: userData.role ? parseInt(userData.role) : undefined,
      status: userData.status ? parseInt(userData.status) : undefined,

      password: hashedPassword,
      Token: token,
      TokenExpiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 heures
     
      profileImage: profileImage[0]?.originalname

    }, entityType);

    await sendPasswordByEmail(newUser.email, newUser.Token, securePassword, entityType)
    res.status(200).json({ message: ' Employee created successfully', });

  } catch (error) {
    console.error('Error deleting Company:', error);
    res.status(500).json({ error: 'An error occurred while deleting Company' });
  }
};
module.exports = { getAllCompany, updateCompany, deleteCompany, getAllEmployee, updateEmployee, deleteEmployee, CreateUser };
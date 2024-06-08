const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createUser, getUserByEmail, sendPasswordByEmail, generateSecurePassword, generateToken } = require('../controller/auth');
const bcrypt = require('bcrypt');


const getAllEmployee = async (req, res) => {
  const { managerId } = req.user;

  try {
    if (!managerId) {
      return res.status(400).json({ error: `missing manger id ` });
    }

    const AllEmployee = await prisma.employee.findMany({
      where: {
        managerId: parseInt(managerId)
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        role: true,
        email: true,
        createdAt: true,
        accountVerified: true,
        status: true,
        profileImage: true,
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
    if (!AllEmployee) {
      return res.status(404).json({ error: `no employees found ` });
    }
    console.log("employees", AllEmployee);
    res.status(200).json({ message: 'Récupération réussie des employés', AllEmployee });

  } catch (error) {
    console.error('Erreur lors de la récupération des employés :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
const getAllAssigneeNames = async (req, res) => {
  const { managerId } = req.user;

  try {
    const EmployeeNames = await prisma.employee.findMany({
      where: {
        managerId: managerId,
        role: {
          in: [1, 2]
        }
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        role: true,
      }
    });

    if (!EmployeeNames) {
      return res.status(404).json({ error: 'No project managers found for this manager and role.' });
    }
    return res.status(200).json({ message: 'Project managers retrieved successfully.', EmployeeNames });

  } catch (error) {
    // In case of error, return a 500 Internal Server Error response with an error message
    console.error('An error occurred while retrieving project managers:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving project managers.' });
  }
};


const getEmployee = async (req, res) => {
  const { employeeId } = req.params;
  console.log("employeeId : " + employeeId);
  try {
    const profileInfo = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      include: {
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
    if (!profileInfo) {
      return res.status(404).json({ error: `employee with not found ` });
    }

    res.status(200).json({ message: 'Récupération réussie de profile info', profileInfo });

  } catch (error) {
    console.error('Erreur lors de la récupération des donnes de profile:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
const UpdateUser = async (req, res, userType) => {
  const editedData = req.body;
  const profileImage = req?.files?.[0]?.originalname;
  console.log("editedData", editedData);
  console.log("profileImage", profileImage);

  try {
    const { id: userId, ...updateFields } = editedData;

    if (profileImage) {
      updateFields.profileImage = profileImage;
    }

    let existingUser;
    let updatedUser;

    if (userType === 'manager') {
      existingUser = await prisma.manager.findUnique({
        where: {
          id: parseInt(userId),
        }
      });

      if (!existingUser) {
        return res.status(404).json({ error: `The Manager with ID ${userId} does not exist or does not belong` });
      }

      updatedUser = await prisma.manager.update({
        where: {
          id: parseInt(userId),
        },
        data: updateFields
      });

    } else if (userType === 'employee') {
      existingUser = await prisma.employee.findUnique({
        where: {
          id: parseInt(userId),
        }
      });

      if (!existingUser) {
        return res.status(404).json({ error: `The Employee with ID ${userId} does not exist or does not belong` });
      }

      updatedUser = await prisma.employee.update({
        where: {
          id: parseInt(userId),
        },
        data: updateFields
      });
    }

    res.status(200).json({ message: `${userType} with ID ${userId} updated successfully` });

  } catch (error) {
    console.error(`Error updating ${userType}:`, error);
    res.status(500).json({ error: `An error occurred while updating ${userType}` });
  }
};

const deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;
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

    res.status(200).json({ message: `employee  with ID ${employeeId} account removed successfully` });

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
        profileImage: true,
        employee: {
          select: {
            id: true
          }
        },
        projects: {
          select: {
            id: true
          }
        }
      }

    });
    if (!AllManager) {
      return res.status(404).json({ error: `no managers found ` });
    }

    res.status(200).json({ message: 'Récupération réussie des managers', AllManager });

  } catch (error) {
    console.error('Erreur lors de la récupération des managers :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
const getManager = async (req, res) => {
  const { managerId } = req.params;

  try {
    const profileInfo = await prisma.manager.findUnique({
      where: { id: parseInt(managerId) },
      include: {
        employee: {
          select: {
            id: true
          }
        },
        projects: {
          select: {
            id: true
          }
        },

      }
    });
    if (!profileInfo) {
      return res.status(404).json({ error: `no manager found ` });
    }
    console.log('profileInfo maanger', profileInfo);
    res.status(200).json({ message: 'Récupération réussie de manager profile', profileInfo });

  } catch (error) {
    console.error('Erreur lors de la récupération de manager profile :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const deleteManager = async (req, res) => {
  const { superAdminId } = req.user;
  const managerId = parseInt(req.params.managerId);


  if (!superAdminId) {
    return res.status(401).json({ error: 'You do not have privilege to delete manager' });
  }
  console.log("Delete Manager", managerId);
  try {
    // Vérifiez si le manager existe
    const existingManager = await prisma.manager.findUnique({
      where: {
        id: parseInt(managerId),
      },

    });

    if (!existingManager) {
      return res.status(404).json({ error: `The Manager with ID ${managerId} does not exist or does not belong` });
    }


    // Suppression des missions liées aux employés du manager
    await prisma.mission.deleteMany({
      where: {
        employee: {
          managerId: managerId
        }
      }
    });

    //Supprimer les assignations de projets des employés
    await prisma.employeeProjectAssignment.deleteMany({
      where: {
        employee: {
          managerId: managerId
        }
      }
    });

    //  Supprimer les employés liés au manager
    await prisma.employee.deleteMany({
      where: { managerId: managerId }
    });


    // Suppression des enregistrements Damage liés aux resources du manager
    await prisma.damage.deleteMany({
      where: {
        resource: {
          project: {
            managerId: managerId
          }
        }
      }
    });

    await prisma.resource.deleteMany({
      where: {
        project: {
          managerId: managerId
        }
      }
    });


    // Suppression des projets créés par le manager
    await prisma.project.deleteMany({
      where: { managerId: managerId }
    });

    // Suppression des ressources liées aux projets du manager

    // Suppression des AiProcessingProject liés aux projets du manager
    await prisma.aiProcessingProject.deleteMany({
      where: {
        project: {
          managerId: managerId
        }
      }
    });



    // Suppression des Infrastructures liées au manager
    await prisma.infrastructure.deleteMany({
      where: { managerId: managerId }
    });

    // Suppression finale du manager
    const deletedManager = await prisma.manager.delete({
      where: { id: managerId }
    });


    res.status(200).json({ message: `Manager with ID ${managerId} removed successfully` });
  } catch (error) {
    console.error('Error deleting Manager:', error);
    res.status(500).json({ error: 'An error occurred while deleting Manager' });
  }
};


const CreateUser = async (req, res, entityType) => {
  try {
    const profileImage = req.files;
    console.log({ profileImage });
    const userData = req.body
    console.log({ userData });

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
    if (entityType === "manager") {
      if (!userData.companyname) {
        return res.status(400).json({ error: 'company name is require' });
      }
      else {
        const manager = await prisma.manager.findUnique({
          where: {
            companyname: userData.companyname
          }
        });
        if (manager) {
          return res.status(400).json({ error: 'company with this name already exist' });
        }
      }
    }

    const newUser = await createUser({
      ...userData,
      //is employee
      managerId: userData.managerId ? parseInt(userData.managerId) : undefined,
      //is employee
      role: userData.role ? parseInt(userData.role) : undefined,

      status: userData.status ? parseInt(userData.status) : undefined,

      password: hashedPassword,
      Token: token,
      TokenExpiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 heures

      profileImage: profileImage[0]?.originalname

    }, entityType);
    if (!newUser) {
      return res.status(400).json({ error: `Failed to create ${entityType}. Please check your input data.` });
    }

    await sendPasswordByEmail(newUser.email, newUser.Token, securePassword, entityType)
    res.status(200).json({ message: ` ${entityType} created successfully` });

  } catch (error) {
    console.error('Error deleting Manager:', error);
    res.status(500).json({ error: 'An error occurred while creating user' });
  }
};
module.exports = { getAllAssigneeNames, getEmployee, getManager, getAllManager, UpdateUser, deleteManager, getAllEmployee, deleteEmployee, CreateUser };
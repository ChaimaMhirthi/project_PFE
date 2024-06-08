const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware pour vérifier le statut de l'utilisateur
const checkStatus = async (req, res, next) => {
    const { employeeId, managerId ,superAdminId} = req.user;
    let user;
    if (superAdminId) {
        return next();
      }
    try {
      if (employeeId) {
        user = await prisma.employee.findUnique({
          where: { id: employeeId },
        });
      } else if (managerId) {
        user = await prisma.manager.findUnique({
          where: { id: managerId },
        });
      }
       else {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      switch (user.status) {
        case 2: // ACTIVE
          next();
          break;
        case 0: // PENDING
          return res.status(403).json({ error: 'Account pending verification' });
        case 1: // SUSPENDED
          return res.status(403).json({ error: 'Account suspended' });
        default:
          return res.status(500).json({ error: 'Unknown user status' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
module.exports = { checkStatus};



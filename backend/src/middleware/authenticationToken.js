const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authenticateToken = asyncHandler(async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const authHeader = authorization.split(' ');
  console.log(res.user);
  if (authHeader[0] === 'Bearer' && authHeader[1]) {
    try {
      const { ACCESS_TOKEN_SECRET } = process.env;
      const decoded = await jwt.verify(authHeader[1], ACCESS_TOKEN_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token is invalid' });
      } else {
        return res.status(401).json({ error: 'User is not authenticated' });
      }
    }
  } else if (!authHeader[0] || authHeader[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Authorization header must start with Bearer' });
  } else {
    return res.status(401).json({ error: 'Token is missing' });
  }
});

const canCreateProject = async (req, res, next) => {
    const { user } = req;
    if ( user.user === 'manager' || (user.user === 'employee' && user.role === 3)) {
        // L'utilisateur est autorisé, passe au middleware suivant
        next();
    } else {
        // L'utilisateur n'est pas autorisé à créer un projet
        return res.status(401).json({ error: 'Unauthorized ,only admin or project manger can create project' });
    }
};
const canManageInfrastructures = async (req, res, next) => {
  const { user } = req;
  if (user.user === 'manager' || (user.user === 'employee' && user.role === 3)) {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
  } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only admin or project manager can Manage the Infrastructures' });
  }
};
const canAddRessources = async (req, res, next) => {
  const { user } = req;
  if (user.user === 'manager' || user.user === 'employee' && user.role === 1) {
      // L'utilisateur est autorisé, passe au middleware suivant
      
      next();
  } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only inspector can upload data' });
  }
};
const canStartProcess = async (req, res, next) => {
  const { user } = req;
  if (user.user === 'manager' || (user.user === 'employee' && user.role === 3)) {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
  } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only project manager or admin can start the process' });
  }
};
const canConfirmResource = async (req, res, next) => {
  const { user } = req;
  if (user.user === 'manager' || user.user === 'employee' && user.role === 1) {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
  } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only inspector can confirm data collection task' });
  }
};
const canEvaluate= async (req, res, next) => {
  const { user } = req;
  if (user.user === 'manager' || user.user === 'employee' && user.role === 2) {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
  } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only expert can  inspection results' });
  }
};
const isSuperAdmin= async (req, res, next) => {
  const { user } = req;
  if (user.user === 'superAdmin' ) {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
  } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only super admin can ..' });
  }
};
module.exports = {canManageInfrastructures, isSuperAdmin,authenticateToken, canCreateProject ,canAddRessources ,canStartProcess ,canConfirmResource ,canEvaluate,canEvaluate};



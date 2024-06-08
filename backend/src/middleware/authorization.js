
const canCreateProject = async (req, res, next) => {
    const { user } = req;
    if (user.user === 'manager' || (user.user === 'employee' && user.role === 3)) {
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
  const canEvaluate = async (req, res, next) => {
    const { user } = req;
    if (user.user === 'manager' || user.user === 'employee' && user.role === 2) {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
    } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only expert can  inspection results' });
    }
  };
  const isSuperAdmin = async (req, res, next) => {
    const { user } = req;
    if (user.user === 'superAdmin') {
      // L'utilisateur est autorisé, passe au middleware suivant
      next();
    } else {
      // L'utilisateur n'est pas autorisé à créer un projet
      return res.status(401).json({ error: 'Unauthorized ,only super admin can ..' });
    }
  };
module.exports = {canManageInfrastructures, isSuperAdmin, canCreateProject, canAddRessources, canStartProcess, canConfirmResource, canEvaluate, canEvaluate };
  
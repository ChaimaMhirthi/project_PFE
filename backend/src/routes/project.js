const router = require('express').Router();

const { createProject, getProjects, updateProject,deleteProject } = require('../controller/project');

router.post('/create', createProject)
router.get('/get', getProjects)
router.put('/update/:id', updateProject)
router.delete('/delete/:id', deleteProject)
module.exports = router;


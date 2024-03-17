const router = require('express').Router();

const { createProject } = require('../controller/project');

router.post('/create', createProject)

module.exports = router;
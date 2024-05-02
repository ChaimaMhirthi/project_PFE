const {  getResultByProjectId} = require('../controller/results');

const router = require('express').Router();
router.get('/:projectId', getResultByProjectId);



module.exports = router;
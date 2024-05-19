const {  getResultByProjectId,updateDamage,deleteDamage} = require('../controller/results');
const {canEvaluate }= require('../middleware/authenticationToken');

const router = require('express').Router();
router.get('/:projectId', getResultByProjectId);
router.post('/', canEvaluate,updateDamage);

router.delete('/:damageId',canEvaluate, deleteDamage);


module.exports = router;
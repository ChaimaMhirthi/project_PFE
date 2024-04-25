const { getInfrastructures } = require('../controller/infrastructure');

const router = require('express').Router();
router.get('/all-infrastructures', getInfrastructures);



module.exports = router;
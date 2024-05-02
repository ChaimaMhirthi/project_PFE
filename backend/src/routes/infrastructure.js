const { getInfrastructures ,updateExistingInfrastructure,createNewInfrastructure} = require('../controller/infrastructure');
const { multerUploadInfrastrImage } = require('../config/multer');

const router = require('express').Router();
router.get('/getall', getInfrastructures);
router.post('/create',multerUploadInfrastrImage.any(),createNewInfrastructure);

router.post('/update', multerUploadInfrastrImage.any(),updateExistingInfrastructure);


module.exports = router;
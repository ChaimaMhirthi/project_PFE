const { getAllInfrastructures ,getInfrastructure ,deleteInfrastructure,updateExistingInfrastructure,createNewInfrastructure} = require('../controller/infrastructure');
const { multerUploadInfrastrImage } = require('../config/multer');

const router = require('express').Router();
router.get('/getall', getAllInfrastructures);
router.get('/get/:id', getInfrastructure);
router.delete('/delete/:id', deleteInfrastructure);

router.post('/create',multerUploadInfrastrImage.any(),createNewInfrastructure);

router.post('/update', multerUploadInfrastrImage.any(),updateExistingInfrastructure);


module.exports = router;
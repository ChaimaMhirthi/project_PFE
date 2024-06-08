const { getAllInfrastructures ,getInfrastructure ,deleteInfrastructure,updateExistingInfrastructure,createNewInfrastructure} = require('../controller/infrastructure');
const { multerUploadInfrastrImage } = require('../config/multer');
const {canManageInfrastructures}=require("../middleware/authorization")

const router = require('express').Router();
router.get('/getall', getAllInfrastructures);
router.get('/get/:id', getInfrastructure);
router.delete('/delete/:id', deleteInfrastructure);

router.post('/create',canManageInfrastructures,multerUploadInfrastrImage.any(), createNewInfrastructure);

router.post('/update',canManageInfrastructures, multerUploadInfrastrImage.any(),updateExistingInfrastructure);


module.exports = router;
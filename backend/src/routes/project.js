const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { multerConfigImage, multerConfig_Video_Fp, handleMulterError } = require('../config/multer');
const {checkProcessingAllowed, createProject, getProjects, updateProject, deleteProject ,start_process,getMultiFormStepData,getAllEmployee,addRessources,ConfirmResource} = require('../controller/project');
const {  canCreateProject,canAddRessources,canStartProcess,canConfirmResource } = require('../middleware/authenticationToken');



// Obtenir les projets
router.get('/get', getProjects);

// Mettre à jour un projet
router.put('/update/:id', updateProject);

// Supprimer un projet
router.delete('/delete/:id', deleteProject);

// Route POST pour créer un projet avec des ressources associées
router.post('/create_project',canCreateProject, createProject);
router.post('/start_process',canStartProcess,start_process );
router.get('/multiFormStepData/:projectId',getMultiFormStepData );
router.get('/get-allemployee',getAllEmployee);
router.post('/add-images',canAddRessources, multerConfigImage.any(), addRessources);

router.post('/add-videos-flightpaths',canAddRessources, multerConfig_Video_Fp.any(), addRessources);
router.post('/confirmResource',canConfirmResource ,ConfirmResource );
router.post('/checkProcessingAllowed',checkProcessingAllowed);

module.exports = router;

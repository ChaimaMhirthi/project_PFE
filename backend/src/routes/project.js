const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { multerConfigImage, multerConfigVideo, multerUploadAllMedia, handleMulterError } = require('../config/multer');
const { createProject, getProjects, updateProject, deleteProject, addResource } = require('../controller/project');

// Obtenir les projets
router.get('/get', getProjects);

// Mettre à jour un projet
router.put('/update/:id', updateProject);

// Supprimer un projet
router.delete('/delete/:id', deleteProject);

// Route POST pour créer un projet avec des ressources associées
router.post('/create_project', multerUploadAllMedia.any(), createProject);


module.exports = router;

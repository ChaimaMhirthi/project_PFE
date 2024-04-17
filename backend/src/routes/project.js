const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { multerConfigImage, multerConfigVideo,multerUploadAllMedia, handleMulterError } = require('../config/multer');
const { createProject, getProjects, updateProject, deleteProject, addResource } = require('../controller/project');

router.get('/get', getProjects);
router.put('/update/:id', updateProject);
router.delete('/delete/:id', deleteProject);

// Configuration de multer pour les fichiers téléchargés


// Route POST pour recevoir les données du formulaire multipart
router.post('/create_project', multerUploadAllMedia.any(), async (req, res) => {
    const { companyId, guestId } = req.body;
    requestData = req.body;
    try {
        console.log(requestData)
        const projectData = {
            ...requestData,
            account: {
                connect: {
                    id: companyId
                }
            }
        };

        if (guestId) {
            projectData.guestcreator = {
                connect: {
                    id: guestId
                }
            };
        }

        const newProject = await prisma.project.create({
            data: projectData
        });

        res.status(201).json("dddd");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating project' });
    }
});


module.exports = router;

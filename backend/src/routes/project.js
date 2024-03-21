const router = require('express').Router();
const multer = require('multer');

const { multerConfigImage, multerConfigVideo,handleMulterError } = require('../config/multer');
const { createProject, getProjects, updateProject, deleteProject, addResource } = require('../controller/project');

router.post('/create', createProject)
router.get('/get', getProjects)
router.put('/update/:id', updateProject)
router.delete('/delete/:id', deleteProject)

router.post('/add-resource/image/:id', multer(multerConfigImage).single('file'),handleMulterError, (req, res) => {
    try {
        if (res.status(200)) {
            addResource(req, res)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/add-resource/video/:id', multer(multerConfigVideo).single('file'), (req, res) => {
    try {
        if (res.status(200)) {
            addResource(req, res)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;
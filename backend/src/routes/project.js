const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { multerConfigImage, multerConfigVideo,handleMulterError } = require('../config/multer');
const { createProject, getProjects, updateProject, deleteProject, addResource } = require('../controller/project');

router.post('/create', createProject)
router.get('/get', getProjects)
router.put('/update/:id', updateProject)
router.delete('/delete/:id', deleteProject)

router.post('/add-resource/image/:id', multer(multerConfigImage).single('file'),handleMulterError, (req, res) => {
    try {
        const dir = path.join(__dirname, 'public', 'images');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, req.file.originalname), req.file.buffer);
        console.log('Saved!');
        addResource(req, res)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
module.exports = router;
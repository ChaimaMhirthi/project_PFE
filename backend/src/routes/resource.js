const router = require('express').Router();
const multer = require('multer');
const {multerConfigImage,multerConfigVideo,handleMulterError} = require('../config/multer');

router.post('/upload/image', multer(multerConfigImage).single('file'),handleMulterError, (req, res) => {
    try {
        res.status(200).json({ filename: req.file.filename,filepath: req.file.path ,type: req.file.mimetype, message: "File uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
});

// router.post('/upload/vedio', multer(multerConfigVideo).single('file'), (req, res) => {
//     try {
//         res.status(200).json({ filename: req.file.filename,filepath: req.file.path ,type: req.file.mimetype, message: "File uploaded successfully" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//         console.log(err);
//     }
// });

module.exports = router;

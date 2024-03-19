const router = require('express').Router();
const multer = require('multer');
const path = require('path');


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../../public/images"));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});

router.post('/upload', upload.single('file'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).json({ filename: req.file.filename,filepath: req.file.path ,type: req.file.mimetype, message: "File uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
});

module.exports = router;

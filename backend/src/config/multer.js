const multer = require('multer');
const path = require('path');

const multerConfigImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../../public/images"));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    }
});


const multerConfigVideo = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../../public/video"));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        const filetypes = /mp4|mkv|avi/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Videos Only!"));
    }
});

function handleMulterError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Multer error: ' + err.message });
    } else if (err && err.message === "Error: Images Only!") {
        return res.status(400).json({ error: 'Only image files (jpeg, jpg, png) are allowed.' });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
}
module.exports = {multerConfigImage,multerConfigVideo,handleMulterError} ;
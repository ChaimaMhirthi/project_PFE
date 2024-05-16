const multer = require('multer');
const path = require('path');

const config = require('../config.json');
const sharedRepo = config.sharedRepo;
console.log("sharedRepo ",sharedRepo);

const multerConfigImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            uploadPath = path.join(sharedRepo, "/uploads/inspectionImages/");
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
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
            cb(null,  path.join(sharedRepo, "/uploads/inspectionVideos/"));
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

const multerConfig_Video_Fp = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let uploadPath = '';
                console.log("sharedRepo",sharedRepo)
                if (file.mimetype.startsWith('video/')) {
                    uploadPath = path.join(sharedRepo, "/uploads/inspectionVideos/");
                } else if (file.mimetype === 'text/plain' || file.mimetype === 'application/json') {
                    uploadPath = path.join(sharedRepo, "/uploads/inspectionFlightpaths/");
                }
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname);
        }

    }),

    fileFilter: function (req, file, cb) {
     if (file.mimetype.startsWith('video/')) {
            // Accepter les vidéos MP4
            cb(null, true);
        } else if (file.mimetype === 'text/plain' || file.mimetype === 'application/json') {
            // Accepter les fichiers texte et JSON
            cb(null, true);

        } else {
            // Rejeter les autres types de fichiers
            cb(new Error('Unsupported file type'));
        }
    }
})

const multerUploadInfrastrImage= multer({
   
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let uploadPath =path.join(sharedRepo, "/uploads/infrastructureImages/");
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
   
});
module.exports = { multerConfigImage, multerConfig_Video_Fp,multerUploadInfrastrImage, handleMulterError };
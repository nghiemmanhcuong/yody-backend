const path = require('path');
const uuid = require('uuid');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, uuid.v4() + ext);
    },
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/webp'
        ) {
            cb(null, true);
        } else {
            req.error = 'only jps, png and jpeg files are supported!';
            cb(null, false);
        }
    },
});

module.exports = upload;

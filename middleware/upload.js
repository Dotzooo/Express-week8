const appError = require('../service/appError');

const multer = require('multer')

const fileSize = 2 * 1024 * 1024;

const upload = multer({
    limits: {
        fileSize,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(appError(400, '檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式'));
        }
        cb(null, true)
    }
}).any()

module.exports = upload
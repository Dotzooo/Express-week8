var express = require('express')
var router = express.Router()

const UploadController = require('../controllers/upload')

const handleErrorAsync = require("../service/handleErrorAsync")
const { isAuth } = require('../service/isAuth')

const upload = require('../middleware/upload')

// 上傳圖片
router.post('/upload', isAuth, upload, handleErrorAsync(UploadController.uploadImage))

module.exports = router
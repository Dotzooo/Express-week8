const handleSuccess = require('../service/handleSuccess')
const appError = require('../service/appError')

const sizeOf = require('image-size')
const { uploadImgur } = require('../service/upload')


const uploadFile = {
    async uploadImage(req, res, next) {
        const { files } = req;
        
        if (!files || !files.length) {
            return appError(400, '尚未上傳檔案', next)
        }

        const dimensions = sizeOf(files[0].buffer)
        if (dimensions.width !== dimensions.height) {
            return appError(400, '圖片長寬不符合 1:1 尺寸', next)
        }

        const response = await uploadImgur(files[0].buffer)
        if (response.status === 400) {
            return appError(400, response.data, next)
        } else {
            handleSuccess(res, response.data.link)
        }

    }
}

module.exports = uploadFile
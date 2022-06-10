const { ImgurClient } = require('imgur');

const uploadImgur = async (buffer) => {
    const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSevret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN
    })

    const response = await client.upload({
        image: buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
    })

    return response;
}

module.exports = { uploadImgur }
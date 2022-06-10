const handleSuccess = require('../service/handleSuccess')
const appError = require('../service/appError')

const bcrypt = require('bcryptjs')
const validator = require('validator')

const { generateSendJWT } = require('../service/isAuth')

const User = require('../models/users');


const users = {

    async getUser(req, res) {

        const allUser = await User.find()

        handleSuccess(res, allUser)
    },

    async singin(req, res, next) {

        const { email, password } = req.body

        if (!email || !password) {
            return appError(400, '帳號及密碼不得為空', next)
        }

        if (!validator.isLength(password, { min: 8 })) {
            return appError(400, '密碼不可少於8碼', next)
        }

        if (!validator.isEmail(email)) {
            return appError(400, 'Email 格式錯誤', next)
        }

        const user = await User.findOne({ email }).select('+password')

        const auth = await bcrypt.compare(password, user.password)

        if (!auth) {
            return appError(400, '資料錯誤', '密碼不正確', next)
        }

        generateSendJWT(user, 200, res);
    },

    async singup(req, res, next) {

        let { email, password, confirmPassword, name } = req.body

        if (!email || !password || !confirmPassword || !name) {
            return appError(400, '欄位未填寫正確', next)
        }

        if (password !== confirmPassword) {
            return appError(400, '密碼不一致', next)
        }

        if (!validator.isLength(password, { min: 8 })) {
            return appError(400, '密碼不可少於8碼', next)
        }

        if (!validator.isEmail(email)) {
            return appError(400, 'Email 格式錯誤', next)
        }

        // 加密密碼
        password = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            email,
            password,
            name
        })

        generateSendJWT(newUser, 201, res)

    },

    async updatePassword(req, res, next) {

        const { password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return appError("400", "密碼不一致！", next)
        }

        if (!validator.isLength(password, { min: 8 })) {
            return appError(400, '密碼不可少於8碼', next)
        }

        newPassword = await bcrypt.hash(password, 12)

        const user = await User.findByIdAndUpdate(req.user.id, {
            password: newPassword
        })

        generateSendJWT(user, 200, res)
    },

    async getProfile(req, res, next) {
        res.status(200).json({
            status: 'success',
            user: req.user
        });
    },

    async updateProfile(req, res, next) {
        const { name } = req.body

        if (!name) {
            return appError(400, '請輸入暱稱', next)
        }

        const user = await User.findByIdAndUpdate(req.user.id, {
            name
        }, { new: true })

        handleSuccess(res, user);
    }
}

module.exports = users
var express = require('express')
var router = express.Router()

const UserController = require('../controllers/users')

const handleErrorAsync = require("../service/handleErrorAsync")
const { isAuth } = require('../service/isAuth')

// 取得所有用戶
router.get('/users', isAuth, handleErrorAsync(UserController.getUser))

// 用戶登入
router.post('/users/sing_in', handleErrorAsync(UserController.singin))

// 用戶註冊
router.post('/users/sing_up', handleErrorAsync(UserController.singup))

// 重設密碼
router.patch('/users/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword))

// 取得個人資料
router.get('/users/profile', isAuth, handleErrorAsync(UserController.getProfile))

// 更新個人資料
router.patch('/users/profile', isAuth, handleErrorAsync(UserController.updateProfile))


module.exports = router

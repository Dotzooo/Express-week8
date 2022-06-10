var express = require('express')
var router = express.Router()

const PostController = require('../controllers/posts')

const handleErrorAsync = require("../service/handleErrorAsync")
const { isAuth } = require('../service/isAuth')


// 取得所有貼文
router.get('/posts', isAuth, handleErrorAsync(PostController.getPosts))

// 新增貼文
router.post('/post', isAuth, handleErrorAsync(PostController.createPost))

// 修改貼文
router.patch('/post/:id', isAuth, handleErrorAsync(PostController.editPost))

// 刪除指定貼文
router.delete('/post/:id', isAuth, handleErrorAsync(PostController.deletePost))

// 刪除所有貼文
router.delete('/posts', isAuth, handleErrorAsync(PostController.deleteAllPosts))

module.exports = router;
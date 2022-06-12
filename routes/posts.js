var express = require('express')
var router = express.Router()

const PostController = require('../controllers/posts')

const handleErrorAsync = require("../service/handleErrorAsync")
const { isAuth } = require('../service/isAuth')


// 取得所有貼文
router.get('/posts', isAuth, handleErrorAsync(PostController.getPosts))

// 取得個人所有貼文列表
router.get('/posts/user/:userID', isAuth, handleErrorAsync(PostController.getUserPosts))

// 取得單一貼文
router.get('/posts/:postID', isAuth, handleErrorAsync(PostController.getPost))

// 新增貼文
router.post('/posts', isAuth, handleErrorAsync(PostController.createPost))

// 新增一則貼文的讚
router.post("/posts/:postID/like", isAuth, handleErrorAsync(PostController.addPostLike))

// 取消一則貼文的讚
router.delete("/posts/:postID/unlike", isAuth, handleErrorAsync(PostController.delPostLike))

// 修改貼文
router.patch('/post/:id', isAuth, handleErrorAsync(PostController.editPost))

// 刪除指定貼文
router.delete('/post/:id', isAuth, handleErrorAsync(PostController.deletePost))

// 刪除所有貼文
router.delete('/posts', isAuth, handleErrorAsync(PostController.deleteAllPosts))

// 新增一則貼文的留言
router.post('/posts/:postID/comment', isAuth, handleErrorAsync(PostController.postComment))

module.exports = router;
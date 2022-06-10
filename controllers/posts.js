const mongoose = require('mongoose')

const User = require('../models/users')
const Post = require('../models/posts')

const handleSuccess = require('../service/handleSuccess')
const appError = require('../service/appError')

const posts = {
    async getPosts(req, res, next) {
        // 時間排序
        const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
        // 關鍵字
        const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {}

        const allPosts = await Post.find(q).populate({
            path: 'user',
            select: 'name photo'
        }).sort(timeSort)

        handleSuccess(res, allPosts)
    },

    async createPost(req, res, next) {
        const { userID, tags, type, content, image } = req.body
        
        const isValid = mongoose.Types.ObjectId.isValid(userID)
        if (!isValid) {
            return appError(400, '資料錯誤，請重新操作', next)
        }

        const isExist = await User.findById(userID)
        if (!isExist) {
            return appError(400, '該用戶不存在，請重新操作', next)
        }

        if (content) {
            const newPost = await Post.create({
                user: userID,
                tags,
                type,
                content,
                image,
            })
            handleSuccess(res, newPost)
        } else {
            appError(400, '請填寫 content', next)
        }
    },

    async editPost(req, res, next) {
        const { body: { content, image }, params: { id } } = req


        const ExistPost = await Post.findById(id).exec()
        if (!ExistPost) {
            return appError(400, '尚未發布貼文!', next)
        }

        if (!content) {
            return appError(400, '請填寫 content', next)
        }

        const post = await Post.findByIdAndUpdate(id, { content, image }, { new: true })

        if (post) {
            handleSuccess(res, post)
        } else {
            appError(400, '貼文修改失敗', next)
        }
    },

    async deletePost(req, res, next) {
        const { id } = req.params

        const post = await Post.findByIdAndDelete(id)

        if (post) {
            handleSuccess(res, '貼文刪除成功')
        } else {
            appError(400, '貼文刪除失敗', next)
        }
    },

    async deleteAllPosts(req, res, next) {
        const postResult = await Post.deleteMany({})
        handleSuccess(res, postResult)
    }
}

module.exports = posts
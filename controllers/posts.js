const mongoose = require('mongoose')

const User = require('../models/users')
const Post = require('../models/posts')
const Comment = require('../models/comment')

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

    async getUserPosts(req, res, next) {
        const { userID } = req.params

        const allPosts = await Post.find({ user: userID }).populate({
            path: "user",
            select: "name photo"
        })

        handleSuccess(res, allPosts)
    },

    async getPost(req, res, next) {
        const { params: { postID } } = req

        if (!(postID && mongoose.Types.ObjectId.isValid(postID))) {
            return appError(400, '資料錯誤，請重新操作')
        }

        const ExistPost = await Post.findById(postID).exec()

        if (!ExistPost) {
            return appError(400, '尚未發布貼文!', next)
        }

        handleSuccess(res, ExistPost)
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

    async addPostLike(req, res, next) {
        const {
            user,
            params: {
                postID
            }
        } = req

        if (!(postID && mongoose.Types.ObjectId.isValid(postID))) {
            return appError(400, '資料錯誤，請重新操作')
        }

        const ExistPost = await Post.findById(postID).exec()

        if (!ExistPost) {
            return appError(400, '尚未發布貼文!', next)
        }

        const data = await Post.findOneAndUpdate({
            _id: postID
        }, {
            $addToSet: { likes: user._id.toString() }
        }, {
            new: true
        })

        handleSuccess(res, data)
    },

    async delPostLike(req, res, next) {
        const {
            user,
            params: {
                postID
            }
        } = req

        if (!(postID && mongoose.Types.ObjectId.isValid(postID))) {
            return appError(400, '資料錯誤，請重新操作')
        }

        const ExistPost = await Post.findById(postID).exec()

        if (!ExistPost) {
            return appError(400, '尚未發布貼文!', next)
        }

        const data = await Post.findOneAndUpdate({
            _id: postID
        }, {
            $pull: { likes: user._id }
        }, {
            new: true
        })

        handleSuccess(res, data)
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
    },

    async postComment(req, res, next) {
        const {
            user,
            body: {
                comment
            },
            params: {
                postID
            }
        } = req;


        if (!(postID && mongoose.Types.ObjectId.isValid(postID))) {
            return appError(400, "請傳入特定貼文", next)
        }
        if (!comment) {
            return appError(400, "請填寫留言內容!", next)
        }

        const ExistPost = await Post.findById(postID).exec()
        if (!ExistPost) {
            return appError(400, "尚未發布貼文!", next)
        }

        const newComment = await Comment.create({ user, comment })

        await Post.updateOne({
            _id: postID
        }, {
            comments: [...ExistPost.comments, newComment._id]
        })

        const postComment = await Comment.findById(newComment.id)
            .populate({
                path: 'user',
                select: 'name photo'
            })

        handleSuccess(res, postComment)
    }
}

module.exports = posts
const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User Id 未填寫']
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
    image: {
      type: String,
      default: ""
    },
    tags: [
      {
        type: String,
        required: [true, '貼文標籤 tags 未填寫']
      }
    ],
    type: {
      type: String,
      enum: ['group', 'person'],
      required: [true, '貼文類型 type 未填寫']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
  },
  {
    versionKey: false
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
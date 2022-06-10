const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email 未填寫'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '請填寫正確的 Email 信箱'],
    },
    name: {
      type: String,
      trim: true,
      required: [true, '暱稱 未填寫'],
    },
    photo: {
      type: String,
      default: '',
    },
    sex: {
      type: String,
      enum: ['male', 'female']
    },
    password: {
      type: String,
      require: [true, '請輸入密碼'],
      minlength: 8,
      select: false
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

// User
const User = mongoose.model('user', userSchema);

module.exports = User;

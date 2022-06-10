var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

// routes
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const postRouter = require('./routes/posts')
const uploadRouter = require('./routes/upload')

// express
var app = express()

require("./connections")

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use(usersRouter)
app.use(postRouter)
app.use(uploadRouter)

// 404 錯誤
app.use(function (req, res, next) {
    res.status(404).json({
        status: 'error',
        message: "無此路由資訊",
    })
})

/**
 * express 錯誤處理
 * 自己設定的 err 錯誤
 * @param {*} err 
 * @param {*} res 
 */
const resErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            message: err.message
        })
    } else {
        // log 紀錄
        console.error('出現重大錯誤', err)
        // 送出罐頭預設訊息
        res.status(500).json({
            status: 'error',
            message: '系統錯誤，請恰系統管理員'
        })
    }
}

/**
 * 開發環境錯誤
 * @param {*} err 
 * @param {*} res 
 */
const resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        error: err,
        stack: err.stack
    })
}

// 錯誤處理
app.use(function (err, req, res, next) {
    // dev
    err.statusCode = err.statusCode || 500
    if (process.env.NODE_ENV === 'dev') {
        return resErrorDev(err, res)
    }
    // production
    if (err.name === 'ValidationError') {
        err.message = "資料欄位未填寫正確，請重新輸入!"
        err.isOperational = true
        return resErrorProd(err, res)
    }
    resErrorProd(err, res)
})

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err)
})

// 伺服器出現重大錯誤時，也就是會吐出大量詳細資料時
process.on('uncaughtException', error => {
    console.error('Uncaught Exception!')
    if (process.env.NODE_ENV === 'dev') {
        console.error(error)
    }
    // 強制停止 process
    process.exit(1)
})

module.exports = app

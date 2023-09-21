// 处理环境变量
require('dotenv').config({ path: '.env.local' })
// 引包
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const md5 = require('md5')
const session = require('express-session')
// 专用于客户端token验证
const { expressjwt: expressJWT } = require('express-jwt')
const { ForbiddenError, ServiceError, UnknownError } = require('./utils/errors')

require('express-async-errors')
// 引入数据库测试数据库连接
require('./dao/db')

// 引入路由
const adminRouter = require('./routes/admin')
const captchaRouter = require('./routes/captcha')
const bannerRouter = require('./routes/banner')
const uploadRouter = require('./routes/upload')
const blogTypeRouter = require('./routes/blogType')
// 创建服务器实例
const app = express()
// 引入 session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
)
// 使用各种中间件
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 配置验证 token接口 token验证错误 err.name = 'UnauthorizedError' token 验证错误 err.message = ' invalid token'
app.use(
  expressJWT({
    secret: md5(process.env.JWT_SECRET), // 服务器所设置的密钥
    algorithms: ['HS256'], // 新版本的 expressJWT 必须要求指定算法
  }).unless({
    // TODO 需要排除的 token 验证的路由  提出为公共 constant
    path: [
      { url: '/api/admin/login', methods: ['POST'] },
      {
        url: '/res/captcha',
        methods: ['GET'],
      },
    ],
  })
)
// 使用路由中间件
app.use('/api/admin', adminRouter)
app.use('/res/captcha', captchaRouter)
app.use('/api/banner', bannerRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/blogtype', blogTypeRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// 错误处理，一旦发生错误在这里统一处理
app.use(function (err, req, res, next) {
  console.log(
    '%c [ 监听错误 err ]-50',
    'font-size:13px; background:pink; color:#bf2c9f;',
    err
  )
  // token 验证错误 抛出自定义错误
  if (err.name === 'UnauthorizedError') {
    res.send(new ForbiddenError('未登录，或者登录过期').toResponseJSON())
  } else if (err instanceof ServiceError) {
    res.send(err.toResponseJSON())
  } else {
    res.send(new UnknownError().toResponseJSON())
  }
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

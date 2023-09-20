const express = require('express')
const router = express.Router()
const { getCaptchaService } = require('../service/captchaService')
/* GET 生成一个验证码 */
router.get('/', async function (req, res, next) {
  // 生成一个验证码 生成的验证码 保存在 session 当中 用户登录的时候与服务器 session中的数据进行比较
  const captcha = await getCaptchaService()
  // 保存验证码到 sesstion 当中
  req.session.captcha = captcha.text
  // 发送验证码图片设置响应头
  res.setHeader('Content-Type', 'iamge/svg+xml')
  res.send(captcha.data)
})

module.exports = router

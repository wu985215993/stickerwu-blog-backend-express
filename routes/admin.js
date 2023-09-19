var express = require('express')
var router = express.Router()

const { loginService } = require('../service/adminService')
/* POST 管理员登陆 */
router.post('/login', async function (req, res, next) {
  // TODO 验证码的验证 captcha的验证
  // 假设上面的验证码已经通过了则进行账号密码的业务逻辑验证在service中
  const result = await loginService(req.body)
  console.log(
    '%c [ result ]-10',
    'font-size:13px; background:pink; color:#bf2c9f;',
    result
  )
})

module.exports = router

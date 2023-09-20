const express = require('express')
const router = express.Router()
const { formatResponse, analysisToken } = require('../utils/tool')
const { loginService, updateAdminService } = require('../service/adminService')
/* POST 管理员登陆 */
router.post('/login', async function (req, res, next) {
  // TODO 验证码的验证 captcha的验证
  // 假设上面的验证码已经通过了则进行账号密码的业务逻辑验证在 service 中
  const result = await loginService(req.body)

  /** 服务层表示登陆成功 */
  if (result.token) {
    res.setHeader('authentication', result.token)
  }
  // 格式化客户端的响应
  res.send(formatResponse(0, '登陆成功', result.data))
})

/** GET 恢复登陆状态 */
router.get('/whoami', async function (req, res, next) {
  const token = req.get('Authorization')
  /**  1. 从客户端的请求拿到 token 解析出来 解密后的 token 及用户信息 */
  const decryptedToken = analysisToken(token)
  // 将解析后的信息返回给客户端
  res.send(
    formatResponse(0, '恢复登陆成功', {
      loginId: decryptedToken.loginId,
      name: decryptedToken.name,
      id: decryptedToken.id,
    })
  )
})

/** PUT 修改管理员信息 */
router.put('/', async function (req, res, next) {
  res.send(await updateAdminService(req.body))
})

module.exports = router

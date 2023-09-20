// admin 模块的业务逻辑层
const md5 = require('md5')
const { loginDao } = require('../dao/adminDao')
const jwt = require('jsonwebtoken')
module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd) // 进行加密
  // 接下来进行数据的验证，也就是查询该条数据在数据库里面有没有 则这里就传到 DAO 层进行验证
  let data = await loginDao(loginInfo)
  let loginSuccess = data && data.dataValues
  // 登陆成功服务器则需要在生成一个 token 添加到 data 当中
  if (loginSuccess) {
    data = data.dataValues
    /** token有效期 */
    let loginPeriod = null
    // 添加 token
    if (loginInfo.remember) {
      // 如果用户勾选了登陆 7 天，那么 remember 里面是有值得，将这个值赋值给 period
      loginPeriod = parseInt(loginInfo.remember)
    } else {
      // 否则，默认时间为 1 天
      loginPeriod = 1
    }
    // 生成 token
    const token = jwt.sign(
      {
        id: data.id,
        loginId: data.loginId,
        name: data.name,
      },
      md5(process.env.JWT_SECRET),
      {
        /** 过期时长 */
        expiresIn: 60 * 60 * 24 * loginPeriod,
      }
    )
    return { data, token }
  }
  return { data }
}

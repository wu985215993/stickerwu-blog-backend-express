// admin 模块的业务逻辑层
const md5 = require('md5')
const { loginDao, updateAdminDao } = require('../dao/adminDao')
const jwt = require('jsonwebtoken')
const { ValidationError } = require('../utils/errors')
const { formatResponse } = require('../utils/tool')

/** 登录 */
module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd) // 进行加密
  // 接下来进行数据的验证，也就是查询该条数据在数据库里面有没有 则这里就传到 DAO 层进行验证
  let data = await loginDao(loginInfo)
  let loginSuccess = data && data.dataValues
  // 登陆成功服务器则需要在生成一个 token 添加到 data 当中
  if (loginSuccess) {
    // 包装用户信息
    data = {
      id: data.dataValues.id,
      loginId: data.dataValues.login_id,
      name: data.dataValues.name,
    }
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
    const token = jwt.sign(data, md5(process.env.JWT_SECRET), {
      /** 过期时长 */
      expiresIn: 60 * 60 * 24 * loginPeriod,
    })
    return { data, token }
  }
  return { data }
}

/** 更新管理员信息 */
module.exports.updateAdminService = async function (updateInfo) {
  // 1. 根据传入的账号信息查询对应的用户 （注意使用旧密码查询）
  const adminInfo = await loginDao({
    loginId: updateInfo.loginId,
    loginPwd: md5(updateInfo.oldLoginPwd),
  })
  // 2. 分为两种情况，有用户信息 或者 无用户信息
  if (adminInfo && adminInfo.dataValues) {
    // 说明密码正确开始修改管理员信息 组装新的对象进行更新
    const newPassword = md5(updateInfo.loginPwd)
    const updateData = {
      name: updateInfo.name,
      loginId: updateInfo.loginId,
      loginPwd: newPassword,
    }
    // result 为 1 返回接口需要的响应信息
    await updateAdminDao(updateData)

    return formatResponse(0, '', {
      loginId: updateData.loginId,
      name: updateData.name,
      id: adminInfo.dataValues.id,
    })
  } else {
    // 3. 无用户信息 密码输入不正确 抛出自定义错误
    throw new ValidationError('用户id or 旧密码输入不正确')
  }
}

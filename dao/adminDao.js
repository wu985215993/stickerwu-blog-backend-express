// DAO层负责与数据库进行交互
const adminModel = require('./model/admin')

// 登陆
module.exports.loginDao = async function (loginInfo) {
  return await adminModel.findOne({
    where: {
      login_id: loginInfo.loginId,
      login_pwd: loginInfo.loginPwd,
    },
  })
}
// 更新管理员
module.exports.updateAdminDao = async function (updateInfo) {
  const { loginId: login_id, loginPwd: login_pwd, name } = updateInfo
  return await adminModel.update(
    {
      name,
      login_id,
      login_pwd,
    },
    {
      where: {
        login_id,
      },
    }
  )
}

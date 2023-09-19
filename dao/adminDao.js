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

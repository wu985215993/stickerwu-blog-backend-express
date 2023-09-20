const md5 = require('md5')
// 格式化响应数据
const jwt = require('jsonwebtoken')
module.exports.formatResponse = (code, msg, data) => {
  return {
    code,
    msg,
    data,
  }
}

/**
 * @function 分析token
 * @param {String} token\
 * @description token来到这注意token是没有过期的
 * @returns 返回token解析结果
 */
module.exports.analysisToken = function (token) {
  return jwt.verify(token.split(' ')[1], md5(process.env.JWT_SECRET))
}

/**
 * 处理数据返回的数组类型的响应数据
 */
module.exports.handleDataPattern = function (data) {
  const arr = []
  for (const i of data) {
    arr.push(i.dataValues)
  }
  return arr
}
module.exports.handleDataPattern = function (data) {
  const arr = []
  for (const i of data) {
    arr.push(i.dataValues)
  }
  return arr
}

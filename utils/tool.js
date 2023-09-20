const md5 = require('md5')
// 格式化响应数据
const jwt = require('jsonwebtoken')
const multer = require('multer')
const multerAliOss = require('multer-aliyun-oss')
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

/** 设置上传图片文件的引擎 */
module.exports.ossUploadImg = multer({
  storage: multerAliOss({
    config: {
      region: process.env.OSS_BUCKET_REGION,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET_NAME,
    },
    destination: 'public/images',
    filename: function (req, file, cb) {
      // 获取文件名
      const originFileName = file.originalname.split('.').at(0)
      // 获取文件后缀
      const extType = file.originalname.split('.').at(-1)
      cb(
        null,
        `${originFileName}-${Date.now()}${Math.floor(
          Math.random() * 9000 + 1000
        )}.${extType}`
      )
    },
  }),
  limits: {
    fileSize: 5 * 1000 * 1000,
    files: 1,
  },
})

const md5 = require('md5')
// 格式化响应数据
const jwt = require('jsonwebtoken')
const multer = require('multer')
const multerAliOss = require('multer-aliyun-oss')
const lodash = require('lodash')

module.exports.formatResponse = (code, msg, data) => {
  return {
    code,
    msg,
    data,
  }
}

/**
 * @function 分析token
 * @param {String} token
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
      const lastDotIndex = file.originalname.lastIndexOf('.')
      const originFileName = file.originalname.substring(0, lastDotIndex)
      // 获取文件后缀
      const fileSuffix = file.originalname.substring(lastDotIndex)

      cb(
        null,
        `${originFileName}-${Date.now()}${Math.floor(
          Math.random() * 9000 + 1000
        )}${fileSuffix}`
      )
    },
  }),
  limits: {
    fileSize: 5 * 1000 * 1000, // 限制图片大小 5MB
    files: 1,
  },
})

/**
 * @example  { createDateTime: '2023-06-28' } =>  { create_date_time: '2023-06-28' }
 * @param {Object} inputObj
 * @returns
 */
module.exports.formatCamelCaseToSnakeCase = (inputObj) => {
  return lodash.mapKeys(inputObj, (value, key) => {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase()
  })
}

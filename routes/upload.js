const express = require('express')
const { ossUploadImg, formatResponse } = require('../utils/tool')
const multer = require('multer')
const { UploadError } = require('../utils/errors')
const router = express.Router()
/* POST 上传图片 single里面为上传控件的 name  */
router.post('/', async function (req, res, next) {
  ossUploadImg.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new UploadError('上传文件失败，请检查文件的大小控制在 5M 以内'))
    } else {
      const path = `https://${process.env.OSS_BUCKET_NAME}.${process.env.OSS_BUCKET_REGION}.aliyuncs.com/public/images/${req.file.filename}`
      res.send(formatResponse(0, '上传文件成功', path))
    }
  })
})

module.exports = router

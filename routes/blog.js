var express = require('express')
const {
  addBlogService,
  findBlogByPageService,
  findBlogByIdService,
  updateBlogService,
  deleteBlogService,
} = require('../service/blogService')
var router = express.Router()

// 添加博客
router.post('/', async function (req, res, next) {
  res.send(await addBlogService(req.body))
})

// 分页获取博客
router.get('/', async function (req, res, next) {
  res.send(await findBlogByPageService(req.query))
})

// 获取其中一个博客 获取博客 前台获取选哟给 文章的 scan_number ++
router.get('/:id', async function (req, res, next) {
  // 前台获取文章不带 token 后台获取文章会带token
  const reqHeaders = req.headers
  res.send(await findBlogByIdService(req.params.id, reqHeaders.authorization))
})

// 修改其中一个博客
router.put('/:id', async function (req, res, next) {
  res.send(await updateBlogService(req.params.id, req.body))
})

// 删除其中一个博客
router.delete('/:id', async function (req, res, next) {
  res.send(await deleteBlogService(req.params.id))
})

module.exports = router

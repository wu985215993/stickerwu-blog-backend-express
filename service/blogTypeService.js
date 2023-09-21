const { validate } = require('validate.js')
const {
  addBlogTypeDao,
  findAllBlogTypeDao,
  findOneBlogTypeDao,
  deleteBlogTypeDao,
  updateBlogTypeDao,
} = require('../dao/blogTypeDao')
const { ValidationError } = require('../utils/errors')
const { formatResponse, handleDataPattern } = require('../utils/tool')

// 新增博客分类
module.exports.addBlogTypeService = async function (newBlogTypeInfo) {
  // 数据验证规则
  const blogTypeRule = {
    name: {
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
    order: {
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
  }
  // 进行数据验证
  const validateResult = validate.validate(newBlogTypeInfo, blogTypeRule)

  if (!validateResult) {
    // 验证通过
    newBlogTypeInfo.article_count = 0 // 因为是新增的文章分类，所以一开始文章数量为 0
    const data = await addBlogTypeDao(newBlogTypeInfo)
    return formatResponse(0, '添加文章分类成功', data)
  } else {
    // 数据验证失败
    throw new ValidationError(validateResult.message || '数据验证失败')
  }
}

// 查询所有博客分类
module.exports.findAllBlogTypeService = async function () {
  const data = await findAllBlogTypeDao()
  const obj = formatResponse(0, '获取文章分类成功', handleDataPattern(data))
  obj.data.sort((a, b) => a.order - b.order)
  return obj
}

// 获取其中一个博客分类
module.exports.findOneBlogTypeService = async function (id) {
  return formatResponse(0, '获取当前分类成功', await findOneBlogTypeDao(id))
}

// 修改其中一个博客分类
module.exports.updateBlogTypeService = async function (id, blogInfo) {
  const data = await updateBlogTypeDao(id, blogInfo)
  return formatResponse(0, '更新分类成功', data)
}

// 删除其中一个博客分类
module.exports.deleteBlogTypeService = async function (id) {
  await deleteBlogTypeDao(id)
  // TODO 这里需要返回受影响的文章的数据，写了文章模块后再回来修改
  return formatResponse(0, '删除成功', true)
}
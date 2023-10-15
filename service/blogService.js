const { validate } = require('validate.js')
const {
  addBlogDao,
  findBlogByPageDao,
  findBlogByIdDao,
  updateBlogDao,
  deleteBlogDao,
} = require('../dao/blogDao')
const { addBlogToType, findOneBlogTypeDao } = require('../dao/blogTypeDao')
const blogTypeModel = require('../dao/model/blogTypeModel')
const { deleteMessageByBlogIdDao } = require('../dao/messageDao')
const { ValidationError } = require('../utils/errors')
const {
  formatResponse,
  handleDataPattern,
  formatCamelCaseToSnakeCase,
  handleTOC,
} = require('../utils/tool')
const lodash = require('lodash')
// 扩展验证规则 在数据库中寻找新增文章传入的文章类型 category_id 比如在数据库中存在
validate.validators.categoryIdIsExist = async function (value) {
  const blogTypeInfo = blogTypeModel.findByPk(value)
  if (blogTypeInfo) {
    return
  }
  return 'CategoryId Is Not Exist'
}

// 添加博客
module.exports.addBlogService = async function (newBlogInfo) {
  // 首先第一个要处理的就是 TOC
  // 经过 handleTOC 函数进行处理之后，现在 newBlogInfo 里面的 TOC 目录就是需要的格式
  // newBlogInfo = handleTOC(newBlogInfo)
  // 接下来，我们将处理好的TOC格式转为字符串
  newBlogInfo.toc = JSON.stringify(newBlogInfo.toc)

  // 初始化新文章的其他信息
  newBlogInfo.scanNumber = 0 // 阅读量初始化为 0
  newBlogInfo.commentNumber = 0 // 评论数初始化为 0

  // 定义验证规则
  const blogRule = {
    title: {
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
    description: {
      presence: {
        allowEmpty: true,
      },
      type: 'string',
    },
    toc: {
      presence: {
        allowEmpty: true,
      },
      type: 'string',
    },
    htmlContent: {
      presence: {
        allowEmpty: true,
      },
      type: 'string',
    },
    markdownContent: {
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
    thumb: {
      presence: {
        allowEmpty: true,
      },
      type: 'string',
    },
    scanNumber: {
      presence: {
        allowEmpty: false,
      },
      type: 'integer',
    },
    commentNumber: {
      presence: {
        allowEmpty: false,
      },
      type: 'integer',
    },
    createDate: {
      presence: {
        allowEmpty: false,
      },
      type: 'integer',
    },
    categoryId: {
      presence: true,
      type: 'integer',
      categoryIdIsExist: true,
    },
  }

  // 对传递过来的数据进行一个验证
  try {
    // 扩展的验证规则里面涉及到异步的操作，所以这里要采用异步的验证方式
    await validate.async(newBlogInfo, blogRule)
    const data = await addBlogDao(formatCamelCaseToSnakeCase(newBlogInfo)) // 进行一个新增
    // 文章新增了  对应的文章分类也应该新增
    await addBlogToType(newBlogInfo.categoryId)
    return formatResponse(0, '', data)
  } catch (err) {
    let errMsg = ''
    for (key in err) {
      errMsg += err[key] + ' '
    }
    // 验证未通过
    throw new ValidationError(errMsg || '数据验证失败')
  }
}

// 根据分页来查询博客
module.exports.findBlogByPageService = async function (pageInfo) {
  const data = await findBlogByPageDao(formatCamelCaseToSnakeCase(pageInfo))
  const rows = handleDataPattern(data.rows)

  const frontRows = rows.map((v) =>
    lodash.omit(
      {
        ...v,
        htmlContent: v.html_content,
        markdownContent: v.markdown_content,
        scanNumber: v.scan_number,
        commentNumber: v.comment_number,
        categoryId: v.category_id,
        createDate: v.create_date,
      },
      [
        'html_content',
        'markdown_content',
        'scan_number',
        'comment_number',
        'category_id',
        'create_date',
      ]
    )
  )
  // 针对  要做一个还原的操作
  frontRows.forEach((it) => {
    it.toc = JSON.parse(it.toc)
  })
  return formatResponse(0, '', {
    total: data.count,
    rows: frontRows,
  })
}

// 根据 id 获取某一篇博文
module.exports.findBlogByIdService = async function (id, auth) {
  const data = await findBlogByIdDao(id)
  // 首先需要重新处理 TOC，还原成一个数组
  data.dataValues.toc = JSON.parse(data.dataValues.toc)
  // 根据 auth 是否有值来决定浏览数是否要自增 有auth则代表是后台获取不增加浏览量 否则增加表示为前台获取
  if (!auth) {
    data.scan_number++
    await data.save()
  }
  const frontData = data.dataValues
  return formatResponse(
    0,
    '',
    lodash.omit(
      {
        ...frontData,
        htmlContent: frontData.html_content,
        markdownContent: frontData.markdown_content,
        scanNumber: frontData.scan_number,
        commentNumber: frontData.comment_number,
        categoryId: frontData.category_id,
        createDate: frontData.create_date,
      },
      [
        'html_content',
        'markdown_content',
        'scan_number',
        'comment_number',
        'category_id',
        'create_date',
      ]
    )
  )
}

// 修改一篇博文
module.exports.updateBlogService = async function (id, newBlogInfo) {
  newBlogInfo.toc = JSON.stringify(newBlogInfo.toc)
  // 首先判断正文内容有没有改变，因为正文内容的改变会影响 TOC
  if (newBlogInfo.htmlContent) {
    // TODO 干掉 TOC逻辑 进入此 if，说明文章的正文内容有所改变，需要重新处理 TOC 目录
    // newBlogInfo = handleTOC(newBlogInfo)

    // 接下来，我们将处理好的TOC格式转为字符串
    newBlogInfo.toc = JSON.stringify(newBlogInfo.toc)
  }
  // 首先判断是否改变了博客分类 若不一样则老的 --，新的分类 ++
  // 获取文章之前的信息
  const { dataValues: oldBlogInfo } = await findBlogByIdDao(id)
  if (newBlogInfo.categoryId !== oldBlogInfo.category_id) {
    // 如果进入此 if 说明修改了此文章的分类信息 则修改前后的文章分类数量都需要修改
    // 旧分类 --
    // 这里旧分类如果没有则不管
    if (oldBlogInfo.category_id) {
      const oldBlogType = await findOneBlogTypeDao(oldBlogInfo.category_id)
      oldBlogType.article_count--
      await oldBlogType.save()
    }
    // 新分类 ++
    const newBlogType = await findOneBlogTypeDao(newBlogInfo.categoryId)
    newBlogType.article_count++
    await newBlogType.save()
  }
  const { dataValues } = await updateBlogDao(
    id,
    formatCamelCaseToSnakeCase(newBlogInfo)
  )
  return formatResponse(0, '', dataValues)
}

// 删除一篇博文
module.exports.deleteBlogService = async function (id) {
  // 根据 id 查询到该篇文章的信息
  const data = await findBlogByIdDao(id)

  // 接下来需要根据该文章对应的分类，该分类下的文章数量自减
  const categoryInfo = await findOneBlogTypeDao(data.dataValues.category_id)
  if (!!categoryInfo) {
    categoryInfo.article_count--
    await categoryInfo.save()
  }
  // 删除一篇文章后其下所对应的评论也要一并删除
  await deleteMessageByBlogIdDao(id)
  // 之后就可以删除这篇文章了
  await deleteBlogDao(id)

  return formatResponse(0, '', true)
}

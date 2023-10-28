const md5 = require('md5')
// 格式化响应数据
const jwt = require('jsonwebtoken')
const multer = require('multer')
const multerAliOss = require('multer-aliyun-oss')
const lodash = require('lodash')
const toc = require('markdown-toc')

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

/**
 * @example  { create_date_time: '2023-06-28' } =>  { createDateTime: '2023-06-28' }
 * @param {Object} inputObj
 * @returns
 */
module.exports.formatSnakeCaseToCamelCase = (inputObj) => {
  return Object.keys(inputObj).reduce((acc, key) => {
    const camelCaseKey = key.replace(/_(\w)/g, (_, p1) => p1.toUpperCase());
    acc[camelCaseKey] = inputObj[key];
    return acc;
  }, {});
}
/**
 * 处理 TOC
 */
module.exports.handleTOC = function (info) {
  let result = toc(info.markdownContent).json
  // 经过上面 toc 方法的处理，就将整个 markdown 里面的标题全部提取出来了
  // 形成一个数组，数组里面是一个个对象，每个对象记录了标题的名称以及等级，如下：

  // [
  //     { content: '数值类型概述', slug: '数值类型概述', lvl: 2, i: 0, seen: 0 },
  //     { content: '整数和浮点数', slug: '整数和浮点数', lvl: 3, i: 1, seen: 0 },
  //     { content: '数值精度', slug: '数值精度', lvl: 4, i: 2, seen: 0 },
  //     { content: '数值范围', slug: '数值范围', lvl: 3, i: 3, seen: 0 },
  //     { content: '数值的表示方法', slug: '数值的表示方法', lvl: 2, i: 4, seen: 0 }
  // ]

  // 但是这不是我们想要的格式，我们想要转换为
  // [
  //     { "name": "章节1", "anchor": "title-1" },
  //     { "name": "章节2", "anchor": "title-2",
  //         "children": [
  //             { "name": "章节2-1", "anchor": "title-2-1" },
  //             { "name": "章节2-2", "anchor": "title-2-2" },
  //         ]
  //     }
  // ]

  // 接下来对上面的数据进行一个转换

  function transfer (flatArr) {
    const stack = [] // 模拟栈的结构
    const result = [] // 存放最终转换结果的数组

    /**
     * 创建 TOC 对象
     * @param {*} item
     * @returns
     */
    function createTOCItem (item) {
      return {
        name: item.content,
        anchor: item.slug,
        level: item.lvl,
        children: [],
      }
    }

    function handleItem (item) {
      // 获取 stack 栈顶的元素，也就是该数组的最后一个元素
      // 如果该数组为空，得到的是一个 undefined
      const top = stack[stack.length - 1]
      if (!top) {
        stack.push(item)
      } else if (item.level > top.level) {
        // 进入此分支，说明当前的 toc 对象的等级比栈顶（之前的上一个）要大
        // 说明当前这个 toc 对象应该成为上一个 toc 对象的子元素
        top.children.push(item)
        stack.push(item)
      } else {
        stack.pop()
        handleItem(item)
      }
    }

    let min = 6 // 标题最小的级别
    // 该 for 循环用于寻找当前数组中最小的标题等级
    for (const i of flatArr) {
      if (i.lvl < min) {
        min = i.lvl
      }
    }

    for (const item of flatArr) {
      const tocItem = createTOCItem(item)
      if (tocItem.level === min) {
        // 如果进入此 if，说明当前的 toc 对象已经是最低的等级，不会作为其他对象的 children
        result.push(tocItem)
      }
      // 如果没有进入上面的 if，说明该 toc 对象不是最低等级，可能是其他 toc 对象 children 数组里面的一员
      handleItem(tocItem)
    }

    return result
  }

  // 经过转换之后，toc 就转为了我们想要的格式
  info.toc = transfer(result)

  delete info.markdownContent

  // 接下来再为各个级别的标题添加上 id
  for (const i of result) {
    switch (i.lvl) {
      case 1: {
        var newStr = `<h1 id="${i.slug}">`
        info.htmlContent = info.htmlContent.replace('<h1>', newStr)
        break
      }
      case 2: {
        var newStr = `<h2 id="${i.slug}">`
        info.htmlContent = info.htmlContent.replace('<h2>', newStr)
        break
      }
      case 3: {
        var newStr = `<h3 id="${i.slug}">`
        info.htmlContent = info.htmlContent.replace('<h3>', newStr)
        break
      }
      case 4: {
        var newStr = `<h4 id="${i.slug}">`
        info.htmlContent = info.htmlContent.replace('<h4>', newStr)
        break
      }
      case 5: {
        var newStr = `<h5 id="${i.slug}">`
        info.htmlContent = info.htmlContent.replace('<h5>', newStr)
        break
      }
      case 6: {
        var newStr = `<h6 id="${i.slug}">`
        info.htmlContent = info.htmlContent.replace('<h6>', newStr)
        break
      }
    }
  }

  return info
}

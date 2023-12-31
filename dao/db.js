// 该文件负责对数据库进行初始化操作
/** 数据库连接实例 */
const sequelize = require('./dbConnect')
/** 数据模型 */
const adminModel = require('./model/adminModel')
const bannerModel = require('./model/bannerModel')
const blogTypeModel = require('./model/blogTypeModel')
const blogModel = require('./model/blogModel')
const demoModel = require('./model/demoModel')
const messageModel = require('./model/messageModel')
const settingModel = require('./model/settingModel')
const aboutModel = require('./model/aboutModel')
const md5 = require('md5')

;(async function () {
  // 定义模型之间的关联关系
  // 博客和博客分类之间的关联
  blogTypeModel.hasMany(blogModel, {
    foreignKey: 'category_id',
    targetKey: 'id',
  })
  blogModel.belongsTo(blogTypeModel, {
    foreignKey: 'category_id',
    targetKey: 'id',
    as: 'category',
  })
  // 博客与评论之间存在关联关系
  blogModel.hasMany(messageModel, {
    foreignKey: 'blog_id',
    targetKey: 'id',
  })
  messageModel.belongsTo(blogModel, {
    foreignKey: 'blog_id',
    targetKey: 'id',
    as: 'blog',
  })
  // 将数据模型和表进行同步
  await sequelize.sync({
    // 同步模型与表
    alter: true,
  })
  // 同步完成后，有一些表是需要一些初始化数据
  // 需要先查询这张表是否有内容 无内容 需要初始化数据
  const adminCount = await adminModel.count()

  if (!adminCount) {
    // TODO 默认超级管理员部分更改
    // 进入此 if 说明该表没有数据 需初始化数据
    await adminModel.create({
      login_id: process.env.DB_ADMIN_NAME,
      name: '超级管理员',
      login_pwd: md5(process.env.DB_ADMIN_PASSWORD),
    })
    console.log('初始化管理员数据完毕...')
  }
  // banner 进行初始化操作
  const bannerCount = await bannerModel.count()

  if (!bannerCount) {
    await bannerModel.bulkCreate([
      {
        mid_img: '/static/images/bg1_mid.jpg',
        big_img: '/static/images/bg1_big.jpg',
        title: '塞尔达旷野之息',
        description: '2017年年度游戏，期待续作',
      },
      {
        mid_img: '/static/images/bg2_mid.jpg',
        big_img: '/static/images/bg2_big.jpg',
        title: '塞尔达四英杰',
        description: '四英杰里面你最喜欢的又是谁呢',
      },
      {
        mid_img: '/static/images/bg3_mid.jpg',
        big_img: '/static/images/bg3_big.jpeg',
        title: '日本街道',
        description: '动漫中经常出现的日本农村街道，一份独特的恬静',
      },
    ])
    console.log('初始化首页标语数据完毕...')
  }
  // 进行一些数据初始化
  const aboutCount = await aboutModel.count() // 首先进行查询看有没有数据
  if (!aboutCount) {
    // 如果没有数据就进行初始化
    await aboutModel.create({
      url: 'https://github.com/wu985215993',
    })
    console.log('初始化关于我数据...')
  }

  // 全局设置数据初始化
  const settingCount = await settingModel.count() // 首先进行查询看有没有数据
  if (!settingCount) {
    // 如果没有数据就进行初始化
    await settingModel.create({
      avatar: '/static/images/wcw_avatar.jpeg',
      site_title: '我的个人空间',
      github: 'https://github.com/wu985215993',
      qq: '985215993',
      qq_qr_code: '/static/images/wcw_qq.JPG',
      weixin: 'stickerwu',
      weixin_qr_code: '/static/images/wcw_weixin.JPG',
      mail: 'stickerwu@outlook.com',
      icp: 'XXXICP备XXXXXX号',
      github_name: 'wu985215993',
      favicon: '',
    })
    console.log('初始化全局设置数据...')
  }
  console.log('数据库数据已经准备完毕...')
})()

// 该文件负责对数据库进行初始化操作
/** 数据库连接实例 */
const sequelize = require('./dbConnect')
/** 数据模型 */
const adminModel = require('./model/admin')
const md5 = require('md5')
;(async function () {
  // 将数据模型和表进行同步
  sequelize.sync({
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
  console.log('数据库数据已经准备完毕...')
})()

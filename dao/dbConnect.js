// 专用于做数据库连接 创建 sqquelize 的实例
// 该文件负责连接数据库
const { Sequelize } = require('sequelize')

console.log(
  '[ process.env.DB_NAME ] >',
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_PORT
)
// 创建数据库连接
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // 配置自己的端口号
    port: process.env.DB_PORT,
    dialect: 'mysql',
    // 关了 log 防止在控制台显示
    logging: false,
  }
)
// 测试数据库连接
;(async function () {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})()

// 向外暴露连接实例
module.exports = sequelize

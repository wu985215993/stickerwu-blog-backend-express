// 管理员数据模型
const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnect')

// 定义数据模型
module.exports = sequelize.define(
  'admin',
  {
    // 这张表拥有那些字段
    login_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    login_pwd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
)

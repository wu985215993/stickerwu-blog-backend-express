const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnect')

// 定义留言板与评论数据模型
module.exports = sequelize.define(
  'message',
  {
    // 这张表拥有哪些字段
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    create_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
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

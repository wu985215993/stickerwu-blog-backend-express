// 博客文章分类数据模型
const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnect')

// 定义数据模型
module.exports = sequelize.define(
  'blogType',
  {
    // 这张表拥有哪些字段
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    article_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
)

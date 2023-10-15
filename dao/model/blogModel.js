// 博客文章数据模型
const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnect')

// 定义数据模型
module.exports = sequelize.define(
  'blog',
  {
    // 这张表拥有哪些字段
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    toc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    html_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markdown_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 缩略图
    thumb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 浏览数
    scan_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    create_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // TODO 后期接入 markdown 上传渲染
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
)

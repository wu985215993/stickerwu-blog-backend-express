// 管理员数据模型
const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnect')

// 定义数据模型
module.exports = sequelize.define(
  'banner',
  {
    mid_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    big_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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

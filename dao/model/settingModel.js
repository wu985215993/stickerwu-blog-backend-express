const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnect')

// 定义数据模型
module.exports = sequelize.define(
  'setting',
  {
    // 在这里定义模型属性
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    site_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qq: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qq_qr_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weixin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weixin_qr_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favicon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // 这是其他模型参数
    freezeTableName: true,
    createdAt: false, // 如果不填 false，可以使用字符值重新命名
    updatedAt: false,
  }
)

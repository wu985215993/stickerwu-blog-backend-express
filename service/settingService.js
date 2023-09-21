const { findSettingDao, updateSettingDao } = require('../dao/settingDao')
const { formatResponse, formatCamelCaseToSnakeCase } = require('../utils/tool')
const lodash = require('lodash')
// 查询全局设置
module.exports.findSettingService = async function () {
  const { dataValues } = await findSettingDao()
  // TODO 优化
  return formatResponse(
    0,
    '',
    lodash.omit(
      {
        ...dataValues,
        siteTitle: dataValues.site_title,
        qqQrCode: dataValues.qq_qr_code,
        weixinQrCode: dataValues.weixin_qr_code,
        githubName: dataValues.github_name,
      },
      ['site_title', 'qq_qr_code', 'weixin_qr_code', 'github_name']
    )
  )
}

// 修改全局设置 TODO 校验
module.exports.updateSettingService = async function (newSettingInfo) {
  const { dataValues } = await updateSettingDao(
    formatCamelCaseToSnakeCase(newSettingInfo)
  )
  return dataValues
}

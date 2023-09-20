const { findBannerDao, updateBannerDao } = require('../dao/bannerDao')
const { handleDataPattern, formatResponse } = require('../utils/tool')

/**
 *
 * @returns 查询 banner
 */
module.exports.findBannerService = async function () {
  return formatResponse(
    0,
    '获取首页标语完成',
    handleDataPattern(await findBannerDao())
  )
}

module.exports.updateBannerService = async function (bannerArr) {
  const data = await updateBannerDao(bannerArr)
  return formatResponse(0, '更新首页标语成功', handleDataPattern(data))
}

const bannerModel = require('./model/bannerModel')

/**
 * @returns 返回数据库查找的banner List
 */
module.exports.findBannerDao = async function () {
  return await bannerModel.findAll()
}

/**
 * @returns 跟新数据库banner
 */
module.exports.updateBannerDao = async function (bannerArr) {
  console.log(
    '%c [ bannerArr ]-14',
    'font-size:13px; background:pink; color:#bf2c9f;',
    bannerArr
  )
  // 将表的记录全部删除掉
  await bannerModel.destroy({
    truncate: true,
  })
  // 转换 banner 数据
  await bannerModel.bulkCreate(formatBannerArrToDB(bannerArr)) // 批量写入数据
  return await bannerModel.findAll()
}

function formatBannerArrToDB(dataArr) {
  return dataArr.map((v) => ({ ...v, mid_img: v.midImg, big_img: v.bigImg }))
}

const svgCaptcha = require('svg-captcha')
module.exports.getCaptchaService = async function (req, res, next) {
  return svgCaptcha.create({
    size: 4,
    ignoreChars: 'iIl10Oo',
    noise: 6,
    color: true,
  })
}

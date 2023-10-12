// 自定义错误处理
// 当错误发生的时候，我们捕获到发生的错误，然后抛出我们自定义的错误
const { formatResponse } = require('./tool')
/**
 * 业务处理错误基类
 */
class ServiceError extends Error {
  /**
   *
   * @param {String} message 错误消息
   * @param {Number} code  错误消息码
   */
  constructor(message, code) {
    super(message)
    this.code = code
  }
  /**
   * @returns 抛出响应给客户端生成的格式
   */
  toResponseJSON() {
    return formatResponse(this.code, this.message, null)
  }
}

/**
 * @example new UploadError('文件上传错误')
 * 文件上传错误
 */
exports.UploadError = class UploadError extends ServiceError {
  constructor(message) {
    // 指定文件上传错误码 413
    super(message, 413)
  }
}
/**
 * 禁止访问错误 token
 */
exports.ForbiddenError = class ForbiddenError extends ServiceError {
  constructor(message) {
    super(message, 401)
  }
}

/**
 * token 验证错误 与后端交互的时候
 */
exports.ValidationError = class ValidationError extends ServiceError {
  constructor(message) {
    super(message, 406)
  }
}
/**
 * @example new NotFoundError()
 * 资源不存在 无资源错误
 */
exports.NotFoundError = class NotFoundError extends ServiceError {
  constructor() {
    super('not found', 404)
  }
}
/**
 * 未知错误
 */
exports.UnknownError = class UnknownError extends ServiceError {
  constructor() {
    super('server internal error', 500)
  }
}
/**
 * 内部执行错误
 */
exports.JavaScriptError = class JavaScriptError extends ServiceError {
  constructor(message) {
    super(message, 500)
  }
}


module.exports.ServiceError = ServiceError

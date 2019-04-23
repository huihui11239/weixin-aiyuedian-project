
var config = require('../config.js');

module.exports = {
  /*
  * [getUrl 请求后端接口路径]
  * @route  {[String]} [传入路径]
  * @source {[String]} [区分接口决定host]
  */
  getUrl(route, source) { 
    if (!source) return ''
    switch (source) {
      case 'app':
        return `${config.appHost}${route}`
      case 'web':
        return `${config.webHost}${route}`
      default:
        return `${config.thee}${route}`
    }
  },
  // 静态资源路径
  getStaticPath() { 
    return `${config.staticPath}`
  },

  // 获取图形验证码地址
  getImgUrl() {
    return `${config.imgHost}`
  },

  // 小程序appId
  getAppId () {
    return `${config.appId}`
  },

  // 小程序原始id
  getOriginId () {
    return `${config.originId}`
  },

  // 小程序自定义id
  getAppType () {
    return `${config.appType}`
  },

  // 获得渠道配置
  getfromTpye() {
    return `${config.fromType}`
  },
};

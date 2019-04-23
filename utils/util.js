const config = require('../config.js');

// 拨打电话
const callPhone = (phoneNumber = '400-6688-878') => {
  wx.makePhoneCall({
    phoneNumber
  })
}
// toast提示
const commonToast = (title = '', icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}
// 前端校验手机号
const checkPhone = phone => {
  if (phone == '') {
    return {
      status: false,
      msg: '请输入您的手机号码'
    }
  }
  if (phone != '' && !/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
    return {
      status: false,
      msg: '请输入正确的手机号码'
    }
  }
  return {
    status: true
  }
}

// 前端校验收货人
const checkReceiverName = name => {
  name = name + ''
  if (name == '') {
    return {
      status: false,
      msg: '请输入您的收货人姓名'
    }
  }
  if (name.length > 16) {
    return {
      status: false,
      msg: '收货人姓名长度不超过16字'
    }
  }
  return {
    status: true
  }
}

// 前端校验详细地址
const checkStreet = street => {
  if (street == '') {
    return {
      status: false,
      msg: '请输入您的详细地址'
    }
  }
  return {
    status: true
  }
}
// 前端校验所在地区
const checkArea = area => {
  if (area == '') {
    return {
      status: false,
      msg: '请输入您的所在地区'
    }
  }
  return {
    status: true
  }
}

// 前端校验短信验证码
const checkVeri = code => {
  let re = /^\d{6}$/
  if (code == '') {
    return {
      status: false,
      msg: '请输入短信验证码'
    }
  }
  if (code != '' && !re.test(code)) {
    return {
      status: false,
      msg: '请输入正确的短信验证码'
    }
  }
  return {
    status: true
  }
}

// 前端校验图片验证码
const checkImgCode = code => {
  if (code == '') {
    return {
      status: false,
      msg: '请输入图形验证码'
    }
  }
  return {
    status: true
  }
}

// 删除数组中指定元素
const removeByValue = (arr, val) => {
  for (let i in arr) {
    if (arr[i] === val) {
      arr.splice(i, 1);
      break;
    }
  }
}
//要用这个！！！！！！
// 价格保留两位小数
const getPriceDouble = price => {
  if (!price) price = 0
  var tprice = price
  var xsd = tprice.toString().split(".")
  if (xsd.length == 1) {
    tprice = tprice.toString() + ".00"
    return tprice
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      tprice = tprice.toString() + "0"
    } else if (xsd[1].length > 2) {
      tprice = Math.round(tprice * 100) / 100
    }
    return tprice
  }
}
// 商品价格保留两位小数
const serverPriceDouble = res => {
  if (!res) return ''
  let arr = res
  for (let i = 0; i < res.length; i++) {
    arr[i].sellPrice = getPriceDouble(arr[i].sellPrice)
    arr[i].marketPrice = getPriceDouble(arr[i].marketPrice)
  }
  return arr
}
// 订单价格保留两位小数
const orderPriceDouble = res => {
  if (!res) return ''
  let arr = res
  for (let i = 0; i < res.length; i++) {
    arr[i].trade.totalPayMoney = getPriceDouble(arr[i].trade.totalPayMoney)
    arr[i].trade.payCashFee = getPriceDouble(arr[i].trade.payCashFee)
  }
  return arr
}

// 拒绝授权 调用
const openConfirm = () => {
  wx.showModal({
    title: '友情提示',
    content: '您点击了拒绝授权，将无法正常使用******的功能体验。',
    showCancel: false
  });
}

// 倒计时转换天-时-分-秒
const countDown = leftTime => {
  var day, hour, min, sec
  day = _formatCountDown(Math.floor(leftTime / 1000 / 60 / 60 / 24))
  hour = _formatCountDown(Math.floor(leftTime / 1000 / 60 / 60 % 24))
  min = _formatCountDown(Math.floor(leftTime / 1000 / 60 % 60))
  sec = _formatCountDown(Math.floor(leftTime / 1000 % 60))
  return {
    day,
    hour,
    min,
    sec
  }
}

// 时间为个位数前面补0
const _formatCountDown = num => {
  num = num < 10 ? '0' + num : num
  return num
}


// 设置本地存储
const setLocalData = (key, value) => {
  value ? wx.setStorageSync(key, value) : ''
}

// 清除车辆搜索条件
const clearSearchCars = () => {
  wx.removeStorageSync('brandName')
  wx.removeStorageSync('keyWords')
  wx.removeStorageSync('firstPayId')
  wx.removeStorageSync('orderId')
}

// 获取路径参数
const getPathArgument = options => {
  if (JSON.stringify(options) == "{}") return
  for (let i in options) {
    setLocalData(i, options[i])
  }
}

// 清除本地存储
const clearLocalData = res => {
  wx.removeStorageSync(res)
}

// 通用导航跳转
const commonNavigator = (url = '', opentype = 'navigate') => {
  switch (opentype) {
    case 'redirect': // 关闭当前页 跳转下一页
      wx.redirectTo({
        url
      })
      break
    case 'switch': // 跳转tabBar页面
      wx.switchTab({
        url
      })
      break
    default: // 不关闭页面 跳转下一页
      wx.navigateTo({
        url
      })
      break
  }
}

// 获取页面路径
const getPagesRoute = (page = 'current') => {
  var _pages = getCurrentPages() //获取加载的页面栈
  switch (page) {
    case 'current': // 获取当前页路径
      return `/${_pages[_pages.length - 1].route}`
    case 'prev': // 获取上一页路径
      return `/${_pages[_pages.length - 2].route}`
    case 'original': // 获取原始页路径
      return `/${_pages[0].route}`
    default:
      return
  }
}

//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function weekChange(n) {
  switch(n){
    case 1:
    return " 周一";
    break;
    case 2:
      return "周二";
      break;
    case 3:
      return "周三";
      break;
    case 4:
      return "周四";
      break;
    case 5:
      return "周五";
      break;
    case 6:
      return "周六";
      break;
    case 0:
      return "周日";
      break;
  }
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
const formatTime = (number, format) => {
  if (!number) return ''
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's', 'w'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  returnArr.push(formatNumber(weekChange(date.getDay())));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**
 * 防止函数抖动工具
 * fn: 函数
 * gapTime：防抖动间隔ms
 */
const notDoubleClick = (fn, gapTime = 500) => {
  let _lastTime = null
  // 返回新的函数
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

/**
 * 自动以console
 * text:内容
 * tag:日志标识
 */
const log = (text, tag = "yuedian") => {
  if (config.debug) {
    switch (typeof(text)) {
      case "object":
        console.log(text)
        break;
      default:
        console.log(tag + "=====>" + text)
    }
  }
}

const loading=(text="加载中...",isMask=false)=>{
    wx.showLoading({
        title: text,
        mask:isMask
    })
}

/**
 * rpx转换px
 */
const rpxTopx = (rpx) => {
  return wx.getSystemInfoSync().windowWidth / 750 * rpx;
}

/**
 * px转换rpx
 */
const pxTorpx = (px) => {
  return 750 / wx.getSystemInfoSync().windowWidth * px;
}


/**
 * 判断变量是否为字符串
 */
const isString=(str)=>{
    return (typeof str=='string')&&str.constructor==String;
}

/**
 * 过滤emoji表情
 */
const filterEmoji=(str)=>{
    let ranges =/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    str = str.replace(ranges, '');
    return str;
}



module.exports = {
  orderPriceDouble,
  serverPriceDouble,
  formatTime,
  checkArea,
  checkStreet,
  checkReceiverName,
  callPhone,
  checkPhone,
  checkVeri,
  checkImgCode,
  removeByValue,
  getPriceDouble,
  openConfirm,
  commonToast,
  countDown,
  setLocalData,
  clearSearchCars,
  getPathArgument,
  clearLocalData,
  commonNavigator,
  getPagesRoute,
  notDoubleClick,
  log,
  rpxTopx,
  pxTorpx,
  loading,
  isString,
  filterEmoji
}
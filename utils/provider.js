import * as events from './events.js'

export function on() {
  events.on.apply(this, arguments)
  return this
}

export function off() {
  events.off.apply(this, arguments)
  return this
}

export function emit() {
  events.emit.apply(this, arguments)
  return this
}

export function once() {
  events.once.apply(this, arguments)
  return this
}

export function getCurrPage() {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  return currentPage
}

export function getFunctionNoop(functionName) {
  return typeof functionName === 'function' ? functionName : function () {
  }
}

export const Provider = (options) => (coustomOptions) => {

  coustomOptions = Object.assign({
    onPageScroll: true,
  }, coustomOptions || {})

  Object.keys(coustomOptions || {}).forEach((eventType) => {
    if ('onShareAppMessage' == eventType && !options[eventType]) {
      return
    }
    if (coustomOptions[eventType]) {
      let callBackFunction = getFunctionNoop(options[eventType])
      options[eventType] = function () {
        this.$emit(eventType, ...arguments)
        if ('onShareAppMessage' == eventType) {
          wx.showShareMenu({
            withShareTicket: true,
          })
          let shareData = callBackFunction.apply(this, arguments)
          return shareData
        }
        return callBackFunction.apply(this, arguments)
      }
    }
  })

  let onLoad = getFunctionNoop(options.onLoad)
  let onUnload = getFunctionNoop(options.onUnload)
  let onShow = getFunctionNoop(options.onShow)
  let onCustomShow = getFunctionNoop(options.onCustomShow)

  //自定义组件
  let attached = getFunctionNoop(options.attached)
  let detached = getFunctionNoop(options.detached)

  function initLoad() {
    this.nextTick = (callback) => {
      let args = Array.prototype.slice.call(arguments, 1) || []
      return new Promise((resolve) => {
        resolve()
      }).then(() => {
        callback.applay(this, args)
        return new Promise((resolve) => {
          resolve()
        })
      })
    }

    this.$on = on
    this.$off = off
    this.$once = once
    this.$emit = emit
    this.page = getCurrPage()
  }

  options.onLoad = function () {
    initLoad.apply(this, arguments)
    return onLoad.apply(this, arguments)
  }

  options.attached = function () {
    initLoad.apply(this, arguments)
    return attached.apply(this, arguments)
  }

  options.detached = options.onUnload = function () {
    this.$off()
    detached.apply(this)
    return onUnload.apply(this, arguments)
  }
  options.onShow = function () {
    onShow.apply(this, arguments)
    if (this.onCustomShowFlageReady) {
      onCustomShow.apply(this, arguments)
    }
    this.onCustomShowFlageReady = true
  }
  let info = wx.getSystemInfoSync()
  options.data = {
    android: /android/i.test(info.system) ? 'android' : '',
    ios: /ios/i.test(info.system) ? 'ios' : '',
    iphone: /iphone/i.test(info.model) ? 'iphone' : '',
    iphoneX: /iPhone\s+X/i.test(info.model) ? 'iphoneX' : '',
    windowHeight: info.windowHeight,
    rpxUnit: info.windowWidth / 750,
    ...(options.data || {}),
  }

  return options
}

export const AppProvider = (options) => () => {
  let onLaunch = getFunctionNoop(options.onLaunch)
  options.onLaunch = function (options) {
    events.off()
    this.appLaunchOptions = options
    return onLaunch.apply(this, arguments)
  }
  let onShow = getFunctionNoop(options.onShow)
  options.onShow = function (options) {
    this.appShowOptions = options
    return onShow.apply(this, arguments)
  }
  return options
}

export const getCurrApp = () => {
  let app = getApp()
  return app
}

export const getCurrAppOptions = () => {
  let app = getCurrApp()
  return app.appShowOptions || app.appLaunchOptions
}








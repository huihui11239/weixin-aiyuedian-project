//app.js//app.js
const api = require('lib/api.js')
const ajax = require('lib/request.js')
const util = require('utils/util.js')
const WxParse = require('wxParse/wxParse.js');
const config=require("config.js")
var tdweapp = require('talkingdata/tdweapp.js');
App({
  onLaunch: function() {
    // 展示本地存储能力
    let that = this;
    that.login().then(res => {});
    that.initUpdate();
    that.initUserInfo();
    that.initSys();
  },
  initUserInfo:function(){
      let that=this;
      // 查看是否授权
      console.log("------------------------------------检查授权");
      wx.getSetting({
          success (res){
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                  console.log("------------------------------------开始获取数据");
                  wx.getUserInfo({
                      success: function(res) {
                          util.log("获取到了数据");
                          that.upDataUserInfo(res.userInfo);
                          wx.setStorageSync("userinfo",res.userInfo);
                      }
                  })
              }else {
                  console.log("------------------------------------无授权");
              }
          }
      })
  },
  initSys: function() {
    // if (wx.getStorageSync("sys_info") == "" || !wx.getStorageSync("isIphoneX") || !wx.getStorageSync("isIOS")) {
      wx.getSystemInfo({
        success: function(res) {
          let modelmes = res.model;
          util.log("------------"+modelmes);
          if (modelmes.search('iPhone X') != -1) {
            wx.setStorageSync("isIphoneX", true)
          }
          if (modelmes.search('iPhone') != -1) {
            wx.setStorageSync("isIOS", true)
          }
          wx.setStorageSync("sys_info", res)
        }
      })
    // }
  },
  onShow: function(option) {
    util.log(option)
    this.globalData.shareTicket = option.shareTicket;
  },

  /**
   * 检查版本更新
   */
  initUpdate: function() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          //当前版本是否低于强更最新版本
          util.log("版本號" + config.versionCode)
          ajax({
            method: 'GET',
            url: api.getUrl(`/manage/data/queryByCodeType/force_updata`, 'app'),

          }).then(res => {
            if (config.versionCode < res.data[0].value) {
              wx.showModal({
                content: '新版本已经准备好，重启可立即更新应用',
                showCancel: false,
                confirmText: "立即更新",
                success: function(res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            } else {
              wx.showModal({
                content: '悦店小程序有新版本，立即更新可获得更好的体验',
                confirmText: "立即更新",
                cancelText: "暂不",
                success: function(res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            }
          })
        });

        updateManager.onUpdateFailed(function() {
          wx.showModal({
            content: '获取新版本失败，请检查网络后重新进入悦店',
            showCancel: false,
            confirmText: "知道了"
          })
        })


      }
    })
  },
  /**
   * 登录
   */
  login(isTry = false) {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          util.log("login")
          util.log(res)
          let code = res.code // 登录拿到的code
          this.globalData.appCode = res.code;
          util.log(res.code)
          let appId = api.getAppId() // 小程序的appId
          ajax({
            method: 'POST',
            url: api.getUrl(`/user/miniLogin/${code}/${appId}`, 'app'),
            header:{
              token:""
            }
          }).then(res => {
            console.log(res)
            switch (res.code) {
              case 0:
                util.setLocalData('token', res.data.token)
                util.setLocalData('levelType', Number(res.data.levelType))
                util.setLocalData('userId', res.data.id)
                console.log("调用" + res.data.id)
                util.setLocalData('inviteCode', res.inviteCode)
                resolve(res);
                //尝试CPS调用
                that.goodCPS();
                break
              case 40002:
                util.setLocalData('ticket', res.data.ticket)
                if (!isTry) {
                  resolve(res)
                }
                break
              default:
                util.commonToast(res.msg)
                reject(res.msg)
                break
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }
      })
    })
  },
  // 定位
  locaFunc() {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.getLocation({
        fail(res) {
          util.commonToast("启用默认位置")
          that.globalData.locaData = {
            siteId: 1,
            areaName: "北京",
            areaCode: "110100"
          }
        },
        complete(res) {
          let latitude = (res.latitude) ? res.latitude : "";
          let longitude = (res.longitude) ? res.longitude : "";
          ajax({
            method: 'POST',
            url: api.getUrl(`/area/inverseAnalysis`, 'app'),
            data: {
              latitude,
              longitude
            }
          }).then(res => {
            if (res.code === 0) {
              resolve(res)
            } else {
              reject(res)
            }
          }).catch((error) => {
            reject(res)
            //console.log('error', error)
          })
        }
      })
    })
  },
  // 新授权
  jurisdiction(contexta, isTry = false) {
    let thata = this;
    let that = contexta;
    return new Promise((resolve, reject) => {
      if (!wx.getStorageSync('token')) {
        this.login().then(res => {
          if (wx.getStorageSync('token') ) {
            if (!wx.getStorageSync('userinfo') && isTry) {
              resolve(resolve)
              that.dialog = that.selectComponent("#dialog");
              that.dialog.showDialog();
            }
            reject(reject);
          } else if (wx.getStorageSync('ticket')) {
            resolve(resolve)
            that.dialog = that.selectComponent("#dialog");
            that.dialog.showDialog();
          }
        }).catch((error) => {
          console.log('error', error)
        })
      } else {
        if (!wx.getStorageSync('userinfo') && isTry) {
          resolve(resolve)
          that.dialog = that.selectComponent("#dialog");
          that.dialog.showDialog();
        }
        reject(reject);
      }
    })
  },
  //直接拿到用户信息
  getUserData(thatA) {
    let that = thatA;
    return new Promise((resolve, reject) => {
      if (!wx.getStorageSync('userinfo')) {
        console.log(1)
        resolve(resolve);
        that.dialog = that.selectComponent("#dialog");
        that.dialog.showDialog();
      } else {
        console.log(2)
        console.log(wx.getStorageSync('userinfo'))
        reject(reject);
      }
    })
  },
  //我的订单气泡
  popNumber() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('token') != '') {
        ajax({
          method: 'POST',
          url: api.getUrl(`/trade/findTradeCount`, 'app'),
          header: {
            'token': wx.getStorageSync('token')
          }
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            resolve(res)
          }
        }).catch((error) => {
          console.log('error', error)
        })
      }
    })
  },
  //商品CPS
  goodCPS() {
    util.log(wx.getStorageSync('token') + "---" + wx.getStorageSync("shareUser"))
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('token') != '' && wx.getStorageSync("shareUser") != '') {
        ajax({
          method: 'POST',
          url: api.getUrl(`/user/bindShareInfo/${wx.getStorageSync("shareUser")}`, 'app'),
          header: {
            'token': wx.getStorageSync('token')
          }
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            wx.setStorageSync("shareUser", '')
            resolve(res)
          }
        }).catch((error) => {
          console.log('error', error)
        })
      }
    })
  },
  /**
   * 隐藏弹窗
   * */
  cancelPop(that, box, translateY, bl = true) {
    let animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(translateY).step()
    that.setData({
      animationData: animation.export()
    });
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        [box]: bl
      })
    }, 100)
  },

  /**
   * 显示弹窗
   * */
  showPop(that, box, translateY, bl = false) {
    let animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'linear'
    });
    animation.translateY(translateY).step();
    that.setData({
      animationData: animation.export(),
      [box]: bl
    });
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 100);
  },

  /**
   * 后台点击统计 2018-9-4 金金金
   */
  statisticsClick(label, msgId) {
    ajax({
      method: 'POST',
      url: api.getUrl(`/push/clickCount/${msgId}/${label}`, 'app'),
    })
  },
  // 查询手机号
  checkPhone() {
    return new Promise((resolve, reject) => {
      let phoneBl = wx.getStorageSync('phoneBlNew')
      if (phoneBl === 1) {
        wx.navigateTo({
          url: '/packagepower/pages/binding/binding'
        })
      } else if (phoneBl === 2) {
        resolve(resolve)
      } else {
        ajax({
          method: 'POST',
          url: api.getUrl(`/user/isBindPhone`, 'app')
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            wx.setStorageSync('phoneBlNew', 1)
            // resolve(res)
            wx.navigateTo({
              url: '/packagepower/pages/binding/binding'
            })
          } else if (res.code === 40008) {
            wx.setStorageSync('phoneBlNew', 2)
            resolve(resolve)
          }
        }).catch((error) => {
          console.log('error', error);
          res.msg ? util.commonToast(res.msg) : ''
        })
      }

    })
  },
  /**
   * 跳转权限列表（需在bindtap的回调里调用）
   * */
  goSetting(setttingStr) {
    return new Promise((resolve, reject) => {
      wx.hideLoading();
      wx.showModal({
        title: "是否打开授权设置页面",
        content: "需要获取您的" + setttingStr + ",请到小程序的设置中打开授权",
        success: function(res) {
          wx.hideLoading();
          if (res.confirm) {
            wx.openSetting()
          }
        }
      })
    })
  },

  /**
   * 更新数据库用户数据
   * */
  upDataUserInfo(userInfo){
      let nickName = userInfo.nickName;
      let headImgUrl = userInfo.avatarUrl;
      let oldUserInfo = wx.getStorageSync("localUserInfo");
      util.log("检查更新")
      if (oldUserInfo) {
          if (wx.getStorageSync("token") && oldUserInfo && (oldUserInfo.avatarUrl != headImgUrl || oldUserInfo.nickName != nickName)) {
              this.requestUserServer(headImgUrl,nickName,userInfo);
          }

      } else {
        this.requestUserServer(headImgUrl,nickName,userInfo);
      }
  },

  requestUserServer(headImgUrl,nickName,userInfo){
      ajax({
          method: 'POST',
          url: api.getUrl(`/user/updateUserInfo`, 'app'),
          data: {
              headImgUrl: headImgUrl,
              nickName: nickName
          }
      }).then(res => {
          if (res.code === 0) {
              wx.setStorageSync("localUserInfo", userInfo);
          }
      })
  },
 
  globalData: {
    ajax, //ajax 请求
    api, //静态路径
    util,
    WxParse,
    addressData: {},
    userInfo: {},
    token: "fe553fed0d92464bfc66739d7d5cbaa3",
    locaData: {
      siteId: 1,
      areaName: "北京",
      areaCode: "110100"
    },
    locaChane: false,
    bus: {},
    userCode: 0,
    oneVip: 1,
    shareTicket: null,
    config
  }
})
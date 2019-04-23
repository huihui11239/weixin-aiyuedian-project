// pageageuser/pages/joinvip/joinvip.js
import {
  Provider
} from '../../../utils/provider.js'
import pagestates from "../../../utils/pagestates/pagestates";
const yd = getApp().globalData

Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    hintNum: 0,
    banner: [{
        url: 'https://img.iyuedian.com/mini/govip/joinvip-banner12.png'
      },
      {
        url: 'https://img.iyuedian.com/mini/govip/joinvip-banner1.png'
      },
      {
        url: 'https://img.iyuedian.com/mini/govip/joinvip-banner2.png'
      },
      {
        url: 'https://img.iyuedian.com/mini/govip/joinvip-banner3.png'
      },
      {
        url: 'https://img.iyuedian.com/mini/govip/joinvip-banner4.png'
      },
      {
        url: 'https://img.iyuedian.com/mini/govip/joinvip-banner5.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    let that = this;
    // yd.util.commonToast("邀请码" + options.inviteCode);
    //群分享消息解析参数

    console.log(options)
    if (options.userId) {
      that.setData({
        userId: options.userId,
        inviteCode: options.inviteCode
      })
    } else {
      //商品二维码参数解析
      var scene = decodeURIComponent(options.scene);
      if (scene != null) {
        var parmer = scene.split("&");
        for (var i = 0; i < parmer.length; i++) {
          var info = parmer[i].split("=");
          switch (info[0]) {
            case "userId":
              (info[1]) ? that.setData({
                userId: info[1]
              }): "";
              break;
            case "inviteCode":
              (info[1]) ? this.setData({
                inviteCode: info[1]
              }): "";
              break
          }
        }
      }
    }
    // yd.util.commonToast(this.data.inviteCode)
    // 解析二维码携带参数
    this.initShareData();
    // this.initShareImage();
  },
  initShareData: function() {
    yd.util.loading();
    let that = this;
    // let pageState = pagestates(this)
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/userInfo/${that.data.userId}`, 'app'),
    }).then(res => {
      // pageState.finish()
      wx.hideLoading()
      console.log(res)
      if (res.code === 0) {
        this.setData({
          userData: res.data
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
      console.log('error', error)
      // pageState.error()
      wx.hideLoading()
    })
  },

  //     initShareData: function() {
  //     yd.util.loading();
  //     let that = this;
  //     const pageState = pagestates(this)
  //     yd.ajax({
  //         method: 'POST',
  //         url: yd.api.getUrl(`/userInvite/vipInviteUser/${that.data.inviteCode}`, 'app'),
  //     }).then(res => {
  //         pageState.finish()
  //         wx.hideLoading()
  //         console.log(res)
  //         if (res.code === 0) {
  //             this.setData({ userData: res.data })
  //
  //         } else {
  //             res.msg ? yd.util.commonToast(res.msg) : ''
  //         }
  //     }).catch((error) => {
  //         console.log('error', error)
  //         pageState.error()
  //         wx.hideLoading()
  //     })
  // },
  kong: function() {

  },
  joinvip: function(e) {
    let that = this;
    getApp().jurisdiction(that).then(res => {
    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        yd.ajax({
          method: 'POST',
          url: yd.api.getUrl(`/user/team/checkOpenCpsVip/${that.data.userId}`, 'app')
        }).then(res => {
          console.log(res)
          if (res.code === 80124) {
            that.setData({
              hintNum: 3
            })
          } else if (res.code == 80123) {
            that.setData({
              hintNum: 5
            })
          } else if (res.code == 80125) {
            console.log(res.data)
            that.setData({
              hintNum: 4,
              id: res.data.tradeId
            })
          } else if (res.code == 0) {
            if (res.data) {
              wx.redirectTo({
                url: `/packagepower/pages/vippurchase/vippurchase?userId=${that.data.userId}&teamuserId=${res.data}`
              })
            } else {
              wx.redirectTo({
                url: "/packagepower/pages/vippurchase/vippurchase?userId=" + that.data.userId
              })
            }
          }

        }).catch((error) => {
          console.log('error', error)
        })
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  //去VIP页
  govippages: function(e) {
    this.setData({
      hintNum: 0
    })
    wx.switchTab({
      url: '/pages/vip/vip'
    })
  },
  //去首页
  gohome: function() {
    this.setData({
      hintNum: 0
    })
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  //关闭弹窗
  goclose: function() {
    this.setData({
      hintNum: 0
    })
  },
  //去订单
  goorder: function() {
    //订单ID&跟分享人id
    let that = this;
    console.log(that.data.id, that.data.userId)
    this.setData({
      hintNum: 0
    })
    wx.navigateTo({
      url: `/pageageuser/pages/orderdetails/orderdetails?id=${that.data.id}`
    })

  },
  jointeam: function(e) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/checkVipInvite/${that.data.inviteCode}`, 'app')
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        // that.setData({hintNum:3})
        that.jointeamok();
      } else {
        if (res.code == 80113) {
          that.setData({
            hintNum: 2,
            failtext: res.msg
          })
        } else {
          res.msg ? yd.util.commonToast(res.msg) : '';
        }
      }
    }).catch((error) => {
      console.log('error', error)
    })

  },
  jointeamok: function() {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/bindVipInviteCode/${that.data.inviteCode}`, 'app')
    }).then(res => {
      if (res.code === 0) {
        // res.msg ? yd.util.commonToast(res.msg) : '';
        yd.util.commonToast('成功加入团队')
        setTimeout(function() {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }, 1000)
      } else {
        res.msg ? yd.util.commonToast(res.msg) : '';
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})({
  onPageScroll: true,
  onShow: true
}))
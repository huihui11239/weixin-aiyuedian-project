// pages/mine/mine.js
import { Provider } from '../../utils/provider.js'
const yd = getApp().globalData
Page(Provider({
	data: {
    //用户个人信息
    userInfo: {
    },
    form: {},
    vipBl: false,
    userBl: false,
    popData:null,
    userId:null,
    temVipShow:false
	},
	onLoad: function (option) {
    let that = this
    this.isVip(this)
    wx.hideShareMenu()
    
	},
  //跳转我的拼团
  goMySpells:function(){
    let that = this;
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        wx.navigateTo({
          url: '../../pageageuser/pages/myspelllist/myspelllist',
        })
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  /**
   * 跳转至地址管理
   */
  gotoAddress: function () {
    let that=this;
    getApp().jurisdiction(that).then(res => {
    
    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        wx.navigateTo({
          url: '../../pageageuser/pages/addressmanagement/addressmanagement',
        })
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  // getUserSetting: function () {
  //   let that = this;
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         that.setData({ userBl: true })
  //       } else {
  //         that.setData({ userBl: false })
  //       }
  //     }
  //   })
  // },
	onShow: function () {
    this.isVip(this)
    this.getInviteP()
    this.getPopNumber()
    this.temVIP()
    // this.getUserSetting()
    this.setData({userId:wx.getStorageSync("userId")})
  },
  onHide: function(){
    if (this.data.temVipShow){
      this.setData({ temVipShow: false })
    }
  },
  // 获得邀请人信息
  getInviteP:function(){
    let that =this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/user/index/inviteUserInfo`, 'app')
      // 暂时使用假数据 
    }).then(res => {
      console.log(res)
      if(res.code===0){
        that.setData({ inviteData: res.data})
      }else{
        
      }
      
    }).catch((error) => {
   
    })

  },

  // 曾经是vip
  temVIP: function () {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/user/index/trialVipMoney`, 'app')
      // 暂时使用假数据
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        if (res.data.vipStatus == 3) {
          res.data.levelEndDate = yd.util.formatTime(res.data.levelEndDate / 1000, 'Y-M-D');
          that.setData({ temVIPData: res.data})
        }else{
          that.setData({ temVIPData:''})
        }
      } else {
        that.setData({ temVIPData: '' })
      }
    }).catch((error) => {

    })
  },


  /**
   * 查看订单
   */
  gotoOrder: function (e) {
    let that=this;
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        wx.navigateTo({
          url: `/pageageuser/pages/order/order?type=${e.target.dataset.type}`,
        })
      }).catch((error) => {
        console.log('error', error)
      })
    })
  
  },
  // 无授权去售后
  gotoafter:function(e){
    let that=this;
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        wx.navigateTo({
          url: `../../pageageuser/pages/aftersale/aftersale`,
        })
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  // // 有授权去售后
  // gotoafter2: function () {
  //   getApp().power().then(res => {
  //     wx.navigateTo({
  //       url: `../../pageageuser/pages/aftersale/aftersale`,
  //     })
  //   }).catch((error) => {
  //     console.log('error', error)
  //   })
  // },
  /**
   * 购买vip
   */
  vippay: function () {
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },
  temvippay: function () {
    wx.navigateTo({
      url: '/packagepower/pages/vippurchase/vippurchase',
    })
  },
  goBalance:function(){
    wx.navigateTo({
      url: '/packagepower/pages/vipbalance/vipbalance',
    })
  },
  // 
  openTemVip:function(){
    this.setData({temVipShow:true})
  },
  // 关闭临时vip
  closeTemVip:function(){
    this.setData({temVipShow: false})
  },
  getPopNumber:function(){
    let that=this;
    getApp().popNumber().then(res => {
      yd.util.log(res)
      that.setData({
        popData:res.data
      })
      if (res.data.unpay != 0 || res.data.unreceive != 0|| res.data.unsend != 0){
        wx.showTabBarRedDot({
          index:3
        })
      }else{
        wx.hideTabBarRedDot({
          index: 3,
        })
      }
    })
  },
  /**
     * 判断vip用户
     */
  isVip: function (that) {
    if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType")>1) {
      that.setData({ vipBl: true, levelType: wx.getStorageSync("levelType")})
    }else{
      that.setData({ vipBl: false, levelType: wx.getStorageSync("levelType") })
      if (wx.getStorageSync('levelType')<2){
        yd.ajax({
          method: 'POST',
          url: yd.api.getUrl(`/user/index/myProfitInfo`, 'app')
          // url: 'http://172.16.1.73:11000/user/index/myProfitInfo',
        }).then(res => {
          if (res.code == 0) {
            this.setData({
              form: res.data
            })
          }
        }).catch((error) => {
          console.log('error', error)
        })
      }

    }
  },
    goGID: function () {
    wx.navigateTo({
        url:"../../packagepower/pages/queryGID/queryGID"
    })
    }
})({
  onPageScroll: true,
  onShow: true
}))


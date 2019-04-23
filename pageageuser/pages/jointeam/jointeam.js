// pageageuser/pages/jointeam/jointeam.js
import { Provider } from '../../../utils/provider.js'
import pagestates from '../../../utils/pagestates/pagestates.js'
const yd = getApp().globalData
Page(Provider({

    /**
     * 页面的初始数据
     */
    data: {
        inviteCode: '',
        userData: '',
        banner:[
          { url: 'https://img.iyuedian.com/mini/govip/joinvip-banner11.png'},
          { url: 'https://img.iyuedian.com/mini/govip/joinvip-banner1.png'},
          { url: 'https://img.iyuedian.com/mini/govip/joinvip-banner7.png' },
          { url: 'https://img.iyuedian.com/mini/govip/joinvip-banner6.png' }
        ],
        hintNum:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      wx.hideShareMenu()
          
        // yd.util.commonToast("邀请码" + options.inviteCode);
        //群分享消息解析参数
       // options.inviteCode='DCBYAE'
        console.log(options);
      if (options.inviteCode){
        this.setData({
          inviteCode: options.inviteCode
        })
      }else{
        //商品二维码参数解析   
        let scene = decodeURIComponent(options.scene);
        let parmer = scene.split("=");
        if (parmer[0] == "inviteCode") {
          this.setData({
            inviteCode: parmer[1]
          })
        }
      }
      // yd.util.commonToast(this.data.inviteCode)
         
      this.initShareData();
      this.initShareImage();
    },
    initShareImage: function () {
        let index = Math.ceil(Math.random() * 10);
        if (index == 0) {
            index = 1;
        }
        this.setData({
            shareImage: "https://img.iyuedian.com/mini/share/" + index + ".png"
        })
    },
    kong:function(){

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

    },
    initShareData: function() {
        yd.util.loading();
        let that = this;
        let pageState = pagestates(this)
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/userInvite/vipInviteUser/${that.data.inviteCode}`, 'app'),
        }).then(res => {
            pageState.finish()
            wx.hideLoading()
            console.log(res)
            if (res.code === 0) {
                this.setData({ userData: res.data })
            } else {
                res.msg ? yd.util.commonToast(res.msg) : ''
            }
        }).catch((error) => {
            console.log('error', error)
            pageState.error()
            wx.hideLoading()
        })
    },
    //弱网函数
    onRetry: function () {
      this.initShareData();
      let pageState = pagestates(this)

    },

    goInfo: function () {
      wx.navigateTo({
        url: '/packagepower/pages/retryinfo/retryinfo',
      })
    },
    //去VIP页面
    govippages:function(e){
        this.setData({hintNum:0})
        wx.switchTab({
            url: '/pages/vip/vip'
        })
    },
    //去首页
    gohome:function(){
        this.setData({hintNum:0})
        wx.switchTab({
            url: '/pages/home/home'
        })
    },
    goclose:function(){
        this.setData({hintNum:0})
    },
        /**
     * 加入团队
     */
    jointeam: function(e) {
      let that = this;
      getApp().jurisdiction(that).then(res => {
      }).catch((error) => {
        getApp().checkPhone(that).then(res => {
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/userInvite/checkVipInvite/${that.data.inviteCode}`, 'app')
          }).then(res => {
            console.log(res)
            if (res.code == 0) {
              that.setData({ hintNum: 3 })
            } else {
              that.setData({ hintNum: 2, failtext: res.msg })
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }).catch((error) => {
          console.log('error', error)
        })
      })
    },
    jointeamok:function () {
        let that=this;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/userInvite/bindVipInviteCode/${that.data.inviteCode}`, 'app')
        }).then(res => {
            console.log(res)
            if (res.code === 0) {
                // res.msg ? yd.util.commonToast(res.msg) : '';
                yd.util.commonToast('成功加入团队')
                setTimeout(function () {
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
    }
})({
  onPageScroll: true,
  onShow: true
}))
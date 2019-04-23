// packagepower/pages/teamdetails/teamdetails.js

import {
  Provider
} from '../../../utils/provider.js'
const yd = getApp().globalData;
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    hasNextPage:true,
    isIphoneX: wx.getStorageSync('isIphoneX'),
    shareBoxBl:true,
    latentList:''
  },
  //长按获取手机号
  getPhone: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.phone,
      success: function (res) {
        wx.showToast({
          title: '手机号码已复制',
          icon: 'none',
          duration: 1500
        })
      }
    });
  },
  //打开分享
  shareOpen:function(){
    let that = this;
    getApp().getUserData(that, true).then(res => {
    }).catch((error) => {

      that.showPop()
      console.log(12321314)
    })
  },
  sendCircle:function(){
    let that = this;
    let userData = wx.getStorageSync('userinfo')
    wx.navigateTo({
      url: '/packagepower/pages/sharecardv2/sharecardv2?userName=' + userData.nickName + "&userIcon=" +
        userData.avatarUrl + "&qrCode=" + that.data.shareData.inviteImgUrl + "&planJoinCount=" +
        that.data.shareData.planJoinCount + "&teamUserCount=" + that.data.shareData.teamUserCount + "&shareImage=" +
        that.data.shareImage
    })
  },
  // 打开分享
  showPop: function () {
    getApp().showPop(this,"shareBoxBl", 320);
  },
  // 关闭分享
  boxCancel: function () {
    getApp().cancelPop(this,"shareBoxBl", 320);
  },
  // 获取信息
  getList:function(){
    let that = this;
    if (that.data.hasNextPage) {
      let latentList = (that.data.latentList) ? that.data.latentList : new Array();
      let latentListNum = (that.data.latentList) ? (that.data.latentList.length + 1) : 1;
      let latentListIndex = latentListNum - 1;
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/user/team/potentialUserList`, 'app'),
        data: {
          pageNum: latentListNum,
          pageSize: 10
        },
        // 暂时使用假数据 wx.getStorageSync('token')
      }).then(res => {
        console.log(res)
        if (res.code == 0) {
          for (let i=0; i < res.data.list.length;i++){
            res.data.list[i].orderTime = yd.util.formatTime(res.data.list[i].orderTime / 1000, 'Y-M-D h:m:s')
          };
          latentList[latentListIndex] = res.data.list;
          that.setData({
            latentList: latentList,
            total: res.data.total,
            hasNextPage: res.data.hasNextPage
          })
          wx.hideLoading();
        } else {
          wx.hideLoading();
          res.msg ? yd.util.commonToast(res.msg) : '';
        }
      }).catch((error) => {
        wx.hideLoading();
        res.msg ? yd.util.commonToast(res.msg) : '';
      })
    } else {}
  },
  // 获取转发信息
  getInvitationData: function (isTry = false) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/vipInviteCode`, 'app')
    }).then(res => {
      wx.hideLoading();
      yd.util.log("显示分享卡片");
      if (res.code === 0) {
        wx.setStorageSync("inviteCode", res.data.inviteCode)
        that.setData({
          shareData: res.data,
        });
        if (isTry) {
          that.showPop();
        }
      } else {
        yd.util.commonToast(res.msg);
      }
    }).catch((error) => { })
  },
  // 转发的图片
  initShareImage: function () {
    let index = Math.ceil(Math.random() * 10);
    if (index == 0) {
      index = 1;
    }
    this.setData({
      shareImage: "https://img.iyuedian.com/mini/share/p" + index + ".png"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorageSync('userinfo')? wx.showShareMenu({ withShareTicket: true }):wx.hideShareMenu();
    this.getInvitationData();
    this.initShareImage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let userData = wx.getStorageSync('userinfo');
    return {
      title: userData.nickName + `邀你加入悦店`,
      imageUrl: 'https://img.iyuedian.com/mini/share/chat_join.png',
      path: '/pageageuser/pages/jointeam/jointeam?inviteCode=' + wx.getStorageSync("inviteCode")
    }
  }
})({
  onPageScroll: true
}))
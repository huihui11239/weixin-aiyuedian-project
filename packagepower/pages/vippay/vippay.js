// packagepower/pages/vippay/vippay.js
const yd = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    vipBl: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isVip(this)
    wx.hideShareMenu()
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
   * 同意协议
   */
  govipsuego(){
    let that = this
    that.setData({ show: !that.data.show })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  /**
   * 判断vip用户
   */
  isVip: function (that) {
    if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType")>1) {
      that.setData({ vipBl: true })
    }
  },
  /**
   * 购买vip
   */
  govippay: yd.util.notDoubleClick(function (e) {
    if (this.data.show==false){
      yd.util.commonToast('请勾选协议')
      return
    }
    wx.navigateTo({
      url: '../../pages/vippurchase/vippurchase',
    })
  }),
  /**
   * 查看协议
   */
  agreement: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: '../../../pageageuser/pages/agreement/agreement',
    })
  }),
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
// packagepower/pages/newwebview/newwebview.js
const yd = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    trues: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this;
    wx.hideShareMenu();
    if (options.token) {
      let webview = options.webview + '?token=' + options.token + '&Cache=' + Date.parse(new Date());
      that.setData({
        path: webview
      });
    } else {
      let webview = options.webview;
      console.log(options.webview)
      that.setData({
        path: webview + '?useragent=mobile' + '&site_id='+yd.locaData.siteId+'&Cache=' + Date.parse(new Date())
      })
    }
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
})
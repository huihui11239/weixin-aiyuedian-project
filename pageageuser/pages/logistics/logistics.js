// pageageuser/pages/logistics/logistics.js
import { Provider } from '../../../utils/provider.js'
const yd = getApp().globalData
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    form: [],
    length: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options)
    this.gologistics(options.id, options.code)
  },
  /**
   * 获取当前物流信息
   */
  gologistics(id, code){
    let that = this
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/packages/queryTms/${code}/${id}`, 'app')
    }).then(res => {
      console.log(res.data)
      if(res.code==0){
          for (let i=0;i<res.data.tmsList.length;i++){
            res.data.tmsList[i].expressTime = yd.util.formatTime(res.data.tmsList[i].expressTime / 1000, 'Y-M-D h:m:s')
          }
          that.setData({
              length: res.data.tmsList.length,
              form: res.data
          })
      }

      console.log(res)
    }).catch((error) => {
      console.log('error', error)
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})({
  onPageScroll: true
}))
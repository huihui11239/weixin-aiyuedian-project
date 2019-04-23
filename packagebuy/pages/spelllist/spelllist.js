// packagepower/pages/limittime/limittime.js
import pagestates from "../../../utils/pagestates/pagestates";

const yd = getApp().globalData;
import {
  Provider
} from '../../../utils/provider.js'

Page(Provider({
  /**
   * 页面的初始数据
   */
  data: {
    sessionWith: 150,
    bookItem: null,
    isLoad: true
  },

  /**
   * 商品跳转
   */
  detSkip: yd.util.notDoubleClick(function(e) {
    let comid = e.currentTarget.dataset.comid;
    let tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: '/packagebuy/pages/details/details?comid=' + comid + "&tag=" + tag,
      complete: function(res) {
        
      },
    })
  }),

  /**
   * 获取场次菜单
   * */
  getActivityList: function(pullBl=false) {
    let that = this;
    let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/activityGoods/getActivityListByGroup/3/${siteId}`, 'app'),
    }).then(res => {
      wx.hideNavigationBarLoading();
      if (res.code === 0) {
        console.log(res)
        that.setData({
          lists: res.data.lists,
          isLoad:false
        })
        pullBl? wx.stopPullDownRefresh():""
      } else {
        pullBl ? wx.stopPullDownRefresh() : "";
        res.msg ? yd.util.commonToast(res.msg) : '';
        that.setData({
          isLoad: false
        })
      }
    }).catch(res=>{
      wx.hideNavigationBarLoading();
      pullBl ? wx.stopPullDownRefresh(): "";
      this.setData({
        isLoad: false
      })
    })
  },
  // 
  onRetry: function() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


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
    this.getActivityList(true);
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
    wx.showNavigationBarLoading();//在标题栏中显示加载
    this.getActivityList(true)
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
    let that = this;
      getApp().tdsdk.share({
          title: 'spelllist',
          path: `packagebuy/pages/spelllist/spelllist`
      });
    return {
      path: `packagebuy/pages/spelllist/spelllist`
    }
  },
})({
  onPageScroll: true,
  onShow: true
}))
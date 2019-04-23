// pageageuser/pages/aftersale/aftersale.js
import { Provider } from '../../../utils/provider.js'
const yd = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    afterList:"",
    hasNextPage:true,
      afterList1:[
          ["http://i3.chunboimg.com/group1/M00/02/B6/rBAK31tXtg2AGnecAADlCRk3nno719_250_200.jpg"]
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.getafterlist();
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
    delskip:function(e){
        wx.navigateTo({
            url: "../aftersaledel/aftersaledel?delobj="+JSON.stringify(e.currentTarget.dataset.del)
        })
    },
  getafterlist:function(){
    let that= this;
    console.log(wx.getStorageSync('userId'))
    if (that.data.hasNextPage){
      let afterListNum = (that.data.afterList)? (that.data.afterList.length + 1) : 1;
      let afterListIndex = afterListNum - 1;
      let afterList = (that.data.afterList)? that.data.afterList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/returns/findReturnPage`, 'app'),
        data: {
          pageNum: afterListNum,
          pageSize: 10
        }
      }).then(res => {
        console.log(res)
        if (res.code == 0) {
          afterList[afterListIndex] = res.data.list;
          that.setData({
            afterList: afterList,
            hasNextPage: res.data.hasNextPage
          })
        }
      }).catch((error) => {
        console.log('error', error)
      })
    }
   
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
    this.getafterlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
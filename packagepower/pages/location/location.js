// pages/location/location.js
// 定位
// 继承封装ajax
const yd = getApp().globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前定位
  },
  // 获取列表函数
  getLocaList :function( ){
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/home/citys`, 'app')
    }).then(res => {
      
      if (res.code === 0) {
   
        let locaList = res.data.citys;

        let locaListNew = new Array();
        // 排序
        let c;
        for (let i = 0 ,u=-1; i < locaList.length; i++,u++){
          let a = locaList[i].first;
          let b = (i > 1) ? locaList[(i-1)].first :"" 
          if(a==b){
            c.push(locaList[i])
          }else{
            if(i>0){
              c = new Array();
              c.push(locaList[i])
              locaListNew.push(c)
            }else{
              c = new Array();
              c.push(locaList[i])
            }
          }
        }
        this.setData({ locaList: locaListNew})
        console.log(locaListNew)
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
   
    })
  },
  //  滑动列表位置
  intoClick:function(e){

    this.setData({ atId: e.currentTarget.dataset.id})
    yd.util.commonToast(e.currentTarget.dataset.id )
  },
   // 手动获取位置
  locaBtn:function(){
    getApp().locaFunc().then(res => {

      let  {siteId, area: { areaName, areaCode } } = res.data
      yd.locaData = {siteId, areaName, areaCode};
      yd.locaChane = true;

      wx.navigateBack({
        delta: 1,
      })
    }).catch((res) => {
    });
  },
  // 点击获取
  locaClick:function(e){
   
    console.log(123)
    yd.locaData.areaName = e.currentTarget.dataset.areaname;
    yd.locaData.areaCode = e.currentTarget.dataset.areacode;
    yd.locaData.siteId = e.currentTarget.dataset.siteid;
    yd.locaChane = true;
    wx.setStorageSync('locaData', yd.locaData);
    wx.navigateBack({
      delta: 1,
    })
  },
  // 
  locaOld:function(e){
    console.log(e.currentTarget.dataset.binddata)
    yd.locaData = e.currentTarget.dataset.binddata;
    yd.locaChane = true;
    wx.navigateBack({
      delta: 1,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.getLocaList();
    let locaBind=wx.getStorageSync('locaData');
    (locaBind)? this.setData({locaBind: locaBind}):'';
    (yd.locaData)? this.setData({locaData: yd.locaData}):'';
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
})
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
    pickerTiemBL:true,
    time: [{
      name: '全部',
      code: 1
    },
    {
      name: '全部',
      code: 1
    }, {
      name: '全部',
      code: 1
    }, {
      name: '全部',
      code: 1
    }, {
      name: '全部',
      code: 1
    }, {
      name: '全部',
      code: 1
    }
    ],
    allTime: [
      {
        year: '全部',
        month: ['全部']
      },
      {
        year: '2018',
        month: ['07', '08', '09', '10', '11', '12']
      },
      {
        year: '2019',
        month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
    ],
    yearIndex: 0,
    monthIndex: 0,
    yearIndexDome: 0,
    monthIndexDome: 0,
    hasNextPage: true,
    isIphoneX: wx.getStorageSync('isIphoneX')
  },
  bindChange: function (e) {
    console.log(e);
    this.setData({ yearIndexDome: e.detail.value[0], monthIndexDome: e.detail.value[1] })
    // this.data.monthIndexDome = e.detail.value[1];
  },
  // 确认时间
  enterTime: function () {
    if (this.data.yearIndex != this.data.yearIndexDome||this.data.monthIndexDome == this.data.monthIndexDome){
      let payDate = (this.data.yearIndexDome!=0)? this.data.allTime[this.data.yearIndexDome].year + '-' + this.data.allTime[this.data.yearIndexDome].month[this.data.monthIndexDome] : "";
      this.setData({
        yearIndex: this.data.yearIndexDome,
        monthIndex: this.data.monthIndexDome,
        hasNextPage: true,
        teamList: "",
        payDate: payDate
      });
      this.getList();
    }
    this.closeTime(); 
  },
  //打开时间
  openTime:function(){
        console.log(123)
    getApp().showPop(this, "pickerTiemBL", 320);
  },
  // 关闭时间
  closeTime:function(){
    getApp().cancelPop(this, "pickerTiemBL", 320);
  },

  getList() {
    let that = this;
    if (that.data.hasNextPage) {
      yd.util.loading();
      that.setData({
        orderPayMoneyCount: "--.--",
        orderTotal: "-",
      })
      let teamList = (that.data.teamList) ? that.data.teamList : new Array();
      let teamListNum = (that.data.teamList) ? (that.data.teamList.length + 1) : 1;
      let teamListIndex = teamListNum - 1;
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/profit/myTeam/orderList`, 'app'),
        data: {
          pageNum: teamListNum,
          pageSize: 10,
          param: this.data.payDate? this.data.payDate :"all"
        }
        // 暂时使用假数据 wx.getStorageSync('token')
      }).then(res => {
        console.log(res)
        if (res.code == 0) {
          for (let i = 0; i < res.data.pageInfo.list.length; i++) {
            res.data.pageInfo.list[i].orderTime = yd.util.formatTime(res.data.pageInfo.list[i].orderTime / 1000, 'Y-M-D h:m:s');
            res.data.pageInfo.list[i].orderMoney = yd.util.getPriceDouble(res.data.pageInfo.list[i].orderMoney)
          };
          teamList[teamListIndex] = res.data.pageInfo.list;
          let idIndex = "id" + teamListIndex;
          that.setData({
            teamList: teamList,
            orderPayMoneyCount: res.data.orderTotalMoney , 
            orderTotal: res.data.orderCount,
            hasNextPage: res.data.pageInfo.hasNextPage,
            idIndex: idIndex
          })
          wx.hideLoading();
        } else {
          wx.hideLoading();
        }
      }).catch((error) => {
        wx.hideLoading();
      })
    } else {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    this.getList();
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
    // this.getList();
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})({
  onPageScroll: true
}))
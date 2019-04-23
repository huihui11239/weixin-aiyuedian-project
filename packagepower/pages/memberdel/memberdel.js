// packagepower/pages/memberdel/memberdel.js
const yd = getApp().globalData;
const api = getApp();
import {
  Provider
} from '../../../utils/provider.js';

Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    demo1: true,
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
    payDate:"",
    // allTime:{
    //   year: ['全部','2018','2019'],
    //   month:['01','02','03','04','05','06','07','08','09','10','11','12']
    // },
    allTime:[
      {
        year:'全部',
        month:['全部']
      },
      {
        year: '2018',
        month:['07','08', '09', '10', '11', '12']
      },
      {
        year: '2019',
        month:['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
    ],
    yearIndex:0,
    monthIndex:0,
    yearIndexDome:0,
    monthIndexDome: 0,
    pickerTiemBL:true,
    hasNextPage:true
  },
  //长按获取手机号
  getPhone:function(e){
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
  //选择时间
  changeStatus: function () {
    this.showPop();
  },
  // 关闭时间
  closeTime: function () {
    this.cancelPop();
  },
  bindChange: function (e) {
    console.log(e);
    this.setData({ yearIndexDome: e.detail.value[0], monthIndexDome: e.detail.value[1]})
    // this.data.monthIndexDome = e.detail.value[1];
  },
  // 确认时间
  enterTime: function () {
    if (this.data.yearIndexDome != this.data.yearIndex || this.data.monthIndexDome != this.data.monthIndex){
      let payDate = (this.data.yearIndexDome != 0) ? this.data.allTime[this.data.yearIndexDome].year + '-' + this.data.allTime[this.data.yearIndexDome].month[this.data.monthIndexDome] : "";
      this.setData({
        yearIndex: this.data.yearIndexDome,
        monthIndex: this.data.monthIndexDome,
        hasNextPage: true,
        partnerList: "",
        payDate: payDate
      });
      this.getMemberSonList(this.data.teamUserId);
    }
    this.cancelPop();
  },
  // 打开时间
  showPop: function () {
    getApp().showPop(this, "pickerTiemBL", 320);
  },
  // 关闭时间
  cancelPop: function () {
    getApp().cancelPop(this, "pickerTiemBL", 320);
  },
  nullEvent: function() {

  },
  //获取个人信息
  getMemberdel: function(id) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/user/team/detailUserInfo`, 'app'),
      data: {
        teamUserId: id
      }
    }).then(res => {
      wx.hideLoading()
      console.log(res);
      if (res.code == 0) {
        res.data.inviteDate = yd.util.formatTime(res.data.inviteDate / 1000, 'Y-M-D h:m:s');
        that.setData({infoData:res.data})
      }
    }).catch((error) => {
      wx.hideLoading();
    })
  },
  //获取团队成员信息
  getMemberSonList: function(id) {
    let that = this;
    if (that.data.hasNextPage) {
      yd.util.loading();
      console.log(that.data.partnerList)
      let partnerListNum = (that.data.partnerList) ? (that.data.partnerList.length + 1) : 1;
      let partnerListIndex = partnerListNum - 1;
      let partnerList = (that.data.partnerList)? that.data.partnerList : new Array();
      let data;
      if(that.data.yearIndex){
        data={
          pageNum: partnerListNum,
          pageSize: 10,
          teamUserId: id,
          payDate: this.data.payDate
        }
      }else{
        data={
          pageNum: partnerListNum,
          pageSize: 10,
          teamUserId: id
        }
      }
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/user/team/detailOrderList`, 'app'),
        data: data
      }).then(res => {
        wx.hideLoading()
        console.log(res);
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].payTime = yd.util.formatTime(res.data.list[i].payTime / 1000, 'Y-M-D h:m:s');
            res.data.list[i].payMoney = yd.util.getPriceDouble(res.data.list[i].payMoney);
          }
          partnerList[partnerListIndex] = res.data.list
          that.setData({
            partnerList: partnerList,
            hasNextPage: res.data.hasNextPage,
            total: res.data.total
          })
        }
      }).catch((error) => {
        wx.hideLoading();
      })
    } else {
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //关闭分享
    wx.hideShareMenu({});
    if (options.teamUserId) {
      console.log(options.teamUserId)
      this.getMemberdel(options.teamUserId);
      this.getMemberSonList(options.teamUserId);
      this.setData({
        teamUserId: options.teamUserId,
        lasttime: options.lasttime
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
    this.getMemberSonList(this.data.teamUserId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})({
  onPageScroll: true,
  onShow: true
}))
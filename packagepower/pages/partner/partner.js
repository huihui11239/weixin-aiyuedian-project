// packagebuy/pages/partner/partner.js\
import {
  Provider
} from '../../../utils/provider.js'

const yd = getApp().globalData;
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {

    hasNextPage: true,
    conditonT: [{
        typeid: 'inviteDate',
        name: '加入时间',
        index: 1
      },
      {
        typeid: 'buyOrderNum',
        name: '自购订单',
        index: 2
      },
      {
        typeid: 'cpsOrderNum',
        name: '分享成单',
        index: 3
      },
      {
        typeid: 'teamNum',
        name: '团队成员数',
        index: 4
      }
    ],
    listCode: {
      pageSize: 10, //总额数
      pageNum: 1, // 第几页
    },
    pickerTiemBL: true,

    status: [
      {
        type:"",
        name:"全部"
      },
      {
        type: 1,
        name: '悦粉'
      },
      {
        type: 2,
        name: 'VIP'
      },
      {
        type: 3,
        name: '黄金VIP'
      }
    ],
    statusIndex:0,
    statusIndexDome:0,
    partnerList:'',
    isIphoneX: wx.getStorageSync('isIphoneX')
  },
  // 去搜索
  searchmem: yd.util.notDoubleClick(function(){
    wx.navigateTo({
      url: '/packagepower/pages/searchmem/searchmem',
    })
  }),
  // 条件选择
  conditonClick: function(e) {
    let that = this;
    let listCode = that.data.listCode;
    let orderBy = e.currentTarget.dataset.typeid;
    let numJudg = listCode.orderBy;
    let orderid = listCode.orderByType;
    if (orderBy == numJudg) {
      if (orderid == 'desc') {
        orderid = 'asc';
      } else {
        orderid = 'desc';
      }
      listCode.orderByType = orderid;
      that.setData({
        listCode: listCode,
        hasNextPage: true,
        partnerList: ""
      });
      that.getList()
    } else {
      orderid = 'desc';
      listCode.orderByType = orderid;
      listCode.orderBy = orderBy;
      that.setData({
        listCode: listCode,
        hasNextPage: true,
        partnerList: ""
      });
      that.getList();
    }
  },
  // 去团队详情
  gomemberdel: yd.util.notDoubleClick(function(e){
    wx.navigateTo({
      url: `/packagepower/pages/memberdel/memberdel?teamUserId=${e.currentTarget.dataset.userid}&lasttime=${e.currentTarget.dataset.lasttime}`,
    })
  }),
  //选择时间
  changeStatus: function() {
    this.showPop();
  },
  // 关闭时间
  closeTime: function(){
    this.cancelPop();
  },
  bindChange:function(e){
    console.log(e);
    this.data.statusIndexDome = e.detail.value;
  },
  // 确认时间
  enterTime: function(){
    if (this.data.statusIndex == this.data.statusIndexDome){
      this.cancelPop();
    }else{
      this.setData({
        statusIndex: this.data.statusIndexDome,
        hasNextPage: true,
        partnerList: ""
      });
      this.getList();
      this.cancelPop();
    }
  },
  // 打开时间
  showPop: function() {
    getApp().showPop(this,"pickerTiemBL",320);
  },
  // 关闭时间
  cancelPop: function() {
    getApp().cancelPop(this,"pickerTiemBL", 320);
  },
  // 获取列表
  getList() {
    let that = this;
    if (that.data.hasNextPage) {
      yd.util.loading();
      console.log(that.data.partnerList)
      let listCode = that.data.listCode
      let partnerListNum = (that.data.partnerList) ? (that.data.partnerList.length + 1) : 1;
      let partnerListIndex = partnerListNum - 1;
      let partnerList = (that.data.partnerList) ? that.data.partnerList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/user/team/userInfoList`, 'app'),
        data: {
          pageNum: partnerListNum,
          pageSize: 10,
          orderBy: listCode.orderBy,
          orderByType: listCode.orderByType,
          levelId: that.data.status[that.data.statusIndex].type
        }
      }).then(res => {
        wx.hideLoading()
        console.log(res);
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].inviteDate = yd.util.formatTime(res.data.list[i].inviteDate / 1000, 'Y-M-D h:m:s');
            res.data.list[i].orderTotalMoney = yd.util.getPriceDouble(res.data.list[i].orderTotalMoney);
          }
          partnerList[partnerListIndex] = res.data.list
          let idIndex = "id" + partnerListIndex;
          that.setData({
            partnerList: partnerList,
            hasNextPage: res.data.hasNextPage,
            idIndex: idIndex,
            total: res.data.total
          })
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
    this.getList()
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
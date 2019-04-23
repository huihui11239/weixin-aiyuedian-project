// packagepower/pages/earnings/earnings.js
import {
  Provider
} from '../../../utils/provider.js'
const yd = getApp().globalData;
Page(Provider({
  /**
   * 页面的初始数据
   */
  data: {
    atType1: 0,
    atType2: 0,
    atType3: "all",
    barState:[
      '自购返现: 购买任意商品成单后您获得的返现收益',
      '分享收益: 将专属商品链接分享给他⼈，成单后您获得的收益',
      '团队津贴: 团队成员购买任意商品，成单后您获得的收益',
      '邀请奖励: 其他⽤户通过您的专属邀请链接开通VIP后您获得的收益'
    ],
    hasNextPage: true,
    totalMoney: "--.--",
    bar1: [{
        types: 0,
        name: "全部"
      },
      {
        types: 1,
        name: "自购返现"
      },
      {
        types: 2,
        name: "分享收益"
      },
      {
        types: 3,
        name: "团队津贴"
      },
      {
        types: 4,
        name: "邀请奖励"
      }
    ],
    bar2: [{
        types: 0,
        name: "全部"
      },
      {
        types: 1,
        name: "预期"
      },
      {
        types: 3,
        name: "已结算"
      }
    ],
    bar3: [{
        types: "all",
        name: "全部"
      },
      {
        types: "yesterday",
        name: "昨日"
      },
      {
        types: "today",
        name: "今日"
      },
      {
        types: "week",
        name: "近7日"
      },
      {
        types: "month",
        name: "本月"
      }
    ],
    direct:false
  },
  
  // 获取列表
  getEarnings() {
    let that = this;
    if (this.data.hasNextPage) {
      yd.util.loading();
      let earningsListNum = (that.data.earningsList)? (that.data.earningsList.length+1) : 1;
      let earningsListIndex = earningsListNum - 1;
      let earningsList = (that.data.earningsList)? that.data.earningsList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/profit/profitList`, 'app'),
        data: {
          profitType: this.data.atType1,
          status: this.data.atType2,
          dateType: this.data.atType3,
          pageSize: 10,
          pageNum: earningsListNum
        }
        // 暂时使用假数据 
      }).then(res => {
        console.log(res)
        if(res.code==0){
          for (let i = 0; i < res.data.pageInfo.list.length; i++) {
            // res.data.pageInfo.list[i].yetimg = res.data.pageInfo.list[i].profitMoney? true:false;
            res.data.pageInfo.list[i].updateTime = yd.util.formatTime(res.data.pageInfo.list[i].updateTime / 1000, 'Y-M-D h:m:s');
            res.data.pageInfo.list[i].orderTime = yd.util.formatTime(res.data.pageInfo.list[i].orderTime / 1000, 'Y-M-D h:m:s');
            res.data.pageInfo.list[i].orderMoney = yd.util.getPriceDouble(res.data.pageInfo.list[i].orderMoney);
            res.data.pageInfo.list[i].profitMoney = yd.util.getPriceDouble(res.data.pageInfo.list[i].profitMoney)
            
          };
          console.log(res)
          earningsList[earningsListIndex] = res.data.pageInfo.list
          let idIndex = 'id' + earningsListIndex;
          res.data.totalMoney = yd.util.getPriceDouble(res.data.totalMoney)
          that.setData({
            earningsList: earningsList,
            hasNextPage: res.data.pageInfo.hasNextPage,
            idIndex: idIndex,
            totalMoney: res.data.totalMoney
          })
        }
        wx.hideLoading();
      }).catch((error) => {
        wx.hideLoading();
      })
    } else {
     
    }
  },
  //bar1 
  condition1(e) {
    let that = this;
    (that.data.atType1 == e.currentTarget.dataset.status) ? "" : this.setData({
      atType1: e.currentTarget.dataset.status,
      earningsList: '',
      hasNextPage: true
    });

  
    this.getEarnings();
  },
  // bar2
  condition2(e) {
    let that = this;
    (that.data.atType2 == e.currentTarget.dataset.status) ? "" : this.setData({
      atType2: e.currentTarget.dataset.status,
      earningsList: '',
      hasNextPage: true,
    });

    this.getEarnings();
  },
  // bar3
  condition3(e) {
    let that = this;
    (that.data.atType3 == e.currentTarget.dataset.status) ? "" : that.setData({
      atType3: e.currentTarget.dataset.status,
      earningsList: '',
      hasNextPage: true,
    });
    this.getEarnings();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    let that = this;
    (options.direct)? that.data.direct=true:"";
    (options.type1) ? that.setData({
      atType1: options.type1
    }): "";
    (options.type2) ? that.setData({
      atType2: options.type2
    }): "";
    (options.type3) ? that.setData({
      atType3: options.type3
    }): "";
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that =this;
    this.setData({
      hasNextPage: true,
      earningsList: ''
    });
    if (that.data.direct){
      getApp().login().then(res => {
        that.getEarnings();
      });
      that.data.direct = false;
    }else{
      wx.getStorageSync('token') ? that.getEarnings() : getApp().login().then(res => {
        that.getEarnings();
      });
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // this.getEarnings();
    // this.setData({hasNextPage: true, earningsList: ''})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getEarnings();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})({
  onPageScroll: true
}))
// packagepower/pages/limittime/limittime.js
import pagestates from "../../../utils/pagestates/pagestates";
const yd = getApp().globalData;
import { Provider } from '../../../utils/provider.js'
Page(Provider({
  /**
   * 页面的初始数据
   */
  data: {
    hasNextPage:true
  },
  goSellList: function (e) {
    wx.navigateTo({
      url: "/packagebuy/pages/spelllist/spelllist"
    })
  },
  // 列表盒子点击事件
  listClick: yd.util.notDoubleClick(function(e){
    console.log(e.currentTarget.dataset.all)
    let that = this;
    let all = e.currentTarget.dataset.all;
    if (all.payStatus==0){
      if ((all.groupStatus == 0 || all.groupStatus == 1 || all.groupStatus == 2 || all.groupStatus == 10 || all.groupStatus == 11) && all.orderStatus==1){ 
        that.payAgain(all.groupId, all.groupOrderId);
      }else{
        yd.util.commonToast('超时未支付，拼团取消')
      }
    }else{
      that.spellDel(all.groupId);
    }
  }),
  // 
  // spellDelClick: yd.util.notDoubleClick(function(e){
  //   this.spellDel(e.currentTarget.dataset.gid);
  // }),
  //
  goOrderDel:function(e){
    wx.navigateTo({
      url: `/pageageuser/pages/orderdetails/orderdetails?id=${e.currentTarget.dataset.goid}`,
    })
  },
  // 拼团详情跳转
  spellDel:function(gid) {
    wx.navigateTo({
      url: `/packagebuy/pages/spelldel/spelldel?gid=${gid}`,
    })
  },
  //再次支付
  payAgain: function (gid,goid){
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/group/rePayGroupOrder/${goid}`, 'app')
    }).then(res => {
      console.log(res);
      // that.setData();
      let payData = res.data.payMap;
      wx.requestPayment({
        'timeStamp': payData.timeStamp,
        'nonceStr': payData.nonceStr,
        'package': payData.package,
        'signType': payData.signType,
        'paySign': payData.paySign,
        success: function (res) {
          wx.showLoading({
            title: "支付成功",
          });
          setTimeout(function () {
            wx.hideLoading();
            wx.navigateTo({
              url: `/packagebuy/pages/spelldel/spelldel?gid=${gid}`,
            })
          }, 2000);
        },
        fail: function (res) {
          that.unLockPaySpell(goid);
          yd.util.commonToast('付款失败')
        }
      })
      }).catch((error) => {
      that.unLockPaySpell(goid);
      console.log('error', error)
    })
  },
  // 拼团订单接触锁定
  unLockPaySpell(id) {
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/group/unLockPayGroupOrder/${id}`, 'app')
    }).then(res => {
    }).catch((error) => {
      console.log("error", error)
    })
  },
  // 获取列表
  getafterlist: function (pullBl=false) {
    let that = this;
    
    console.log(wx.getStorageSync('userId'))
    if (that.data.hasNextPage) {
      that.setData({isLoad:true});
      let afterListNum = (that.data.afterList) ? (that.data.afterList.length + 1) : 1;
      let afterListIndex = afterListNum - 1;
      let afterList = (that.data.afterList) ? that.data.afterList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/group/myGroupList/${afterListNum}/10`, 'app')
      }).then(res => {
        console.log(res)

        if (res.code == 0) {
          afterList[afterListIndex] = res.data.list;
          that.setData({
            afterList: afterList,
            hasNextPage: res.data.hasNextPage
          })
        }
        that.setData({isLoad:false});
        pullBl? wx.stopPullDownRefresh():"";
      }).catch((error) => {
        console.log('error', error)
        that.setData({ isLoad: false });
        pullBl? wx.stopPullDownRefresh():"";
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
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
    this.getafterlist();
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
    this.data.afterList='';
    this.data.hasNextPage=true;
    this.getafterlist(true);
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
  
  },
})({
  onPageScroll: true,
  onShow: true
}))
    // pageageuser/pages/order/order.js
import { Provider } from '../../../utils/provider.js'
const yd = getApp().globalData;
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    distance: 46,
    num: 0,//订单状态
    currentPage: 1,//订单页数
    pages: 1, //最大的页数
    form: {},
    length: 1,
    datashow: false,
    show: false,
    list: [] //暂存的订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    let index=0;
    switch (Number(options.type)) {
      case 100:
        index = 46
        break;
      case 0:
        index = 185
        break;
      case 2:
        index = 337
        break;
      case 3:
        index = 485
        break;
      case 55:
        index = 640
        break;
      default:
        index = 46
    }
    that.setData({
      distance: index,
      num: options.type
    })
  },
  /**
   * 获取订单列表
   */

  orderList(){
    let that = this
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/findTradeList/${that.data.num}/${that.data.currentPage}/${that.data.pages}`, 'app')
    }).then(res => {
      if (res.code == 0) {
        console.log(res);
        res.data.myVo = yd.util.orderPriceDouble(res.data.myVo)
        if (res.data.pages == that.data.currentPage){
          that.setData({ datashow: true });
        }else{
          that.setData({ datashow: false });
        }
        that.data.pages = res.data.pages;
        for (let i = 0; i < res.data.myVo.length;i++){
          // res.data.myVo[i].trade.payCashFee = yd.util.getPriceDouble(res.data.myVo[i].trade.payCashFee)
          that.data.list.push(res.data.myVo[i])
        }
        let show = false;
        if (that.data.list==''){
          show = true
        }
        that.setData({ form: that.data.list, length: res.data.total - 1, show: show});
      } else if (res.code == 33003){
        that.setData({ show: true });
      }
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
    this.setData({ form: '' });
    this.data.list = [];
    this.orderList()
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
    if (this.data.datashow==false){
      this.data.currentPage++
      this.orderList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 再次购买
   */
  againBuy: yd.util.notDoubleClick(function (e) {
      wx.navigateTo({
        url: '../../../packagebuy/pages/details/details?comid=' + e.currentTarget.dataset.id,
      })
  }),
  /**
   * 切换状态
   */
  switchType(e){
    if (e.target.dataset.num==this.data.num){
      return
    }
    this.setData({
      distance: e.target.dataset.distance,
      num: e.target.dataset.num,
      currentPage: 1,//订单页数
      pages: 1, //最大的页数
    })
    this.data.list = []
    this.orderList()
  },
  /**
   * 查看物流
   */
  goLogistics: yd.util.notDoubleClick(function (e) {
      let that = this
      yd.ajax({
          method: 'POST',
          url: yd.api.getUrl(`/trade/checkTmsMsg/${e.currentTarget.dataset.item}`, 'app')
      }).then(res => {
          if (res.data.type==2){
              wx.navigateTo({
                url: `../../pages/orderdetails/orderdetails?id=${e.currentTarget.dataset.item}&tag=订单列表`,
              })
          }else{
              wx.navigateTo({
                  url: `../../pages/logistics/logistics?id=${res.data.obj.id}&code=${e.currentTarget.dataset.code}`,
              })
          }
          console.log(res)
      }).catch((error) => {
          console.log('error', error)
      })

  }),
    /**
     * 订单详情
     */
  goDetails: yd.util.notDoubleClick(function (e) {
        wx.navigateTo({
          url: `../../pages/orderdetails/orderdetails?id=${e.currentTarget.dataset.item}&tag=订单列表`,
        })
  }),
  /**
   * 查看物流
   */
  // logistics(e){
  //   wx.navigateTo({
  //     url: `../../pages/logistics/logistics?id=${e.currentTarget.dataset.item.tradeCode}`,
  //   })
  // },
  //  支付订单需要确认的是 id在哪
  payOrder: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: `../../pages/orderdetails/orderdetails?id=${e.currentTarget.dataset.tradeid}&pay=1&tag=订单列表`,
    })
  }),
  // 确认收货
  receipt(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '您是否已收到该订单商品？',
      success: function (res) {
        if (res.confirm) {
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/trade/receiveOrder/${e.currentTarget.dataset.item}`, 'app'),
            header: {
              'token': wx.getStorageSync('token')
            }
          }).then(res => {
            that.data.list = [];
            that.orderList()
          }).catch((error) => {
            console.log('error', error)
          })
        }
      }
    })
    
  },
  //申请退款
  refund:function (e) {

    let refunddata=JSON.stringify(e.currentTarget.dataset);
    console.log(refunddata);
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
        url: '../../pages/refund/refund?refunddata='+refunddata,
    })
  }
})({
  onPageScroll: true
}));
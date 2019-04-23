// pageageuser/pages/orderdetails/orderdetails.js
import { Provider } from '../../../utils/provider.js'
import pagestates from "../../../utils/pagestates/pagestates";
const yd = getApp().globalData
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    minute: '',//分钟
    minute1: '',//分钟
    second: '',//秒
    show: false,
    id: '',
    timeIndex: '',
    rstoken: '',
    vipindex: false, //订单是否是vip
    isIphoneX: wx.getStorageSync('isIphoneX'),
    isCollectData:true,
    tag: '默认',
    orderData:null,
    selfEarningsPrice:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.data.id = options.id
    if (options.pay){
      this.orderDetails(options.id, options.pay)
    }else{
      this.orderDetails(options.id)
    }
    this.setData({
        tag:options.tag,
        selfEarningsPrice:options.selfEarningsPrice
    })
    this.isrsToken();
    this.isVip(this);
  },
  /**
   * 获取重复提交token
   */
  isrsToken: function () {
    let that = this
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/rsToken`, 'app')
    }).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        that.data.rstoken = res.header.rstoken
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },
  /**
   * 订单详情
   */
  orderDetails(id,index){
    let that = this
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/findMyTradeDetail/${id}`, 'app')
    }).then(res => {
        yd.util.log("订单数据")
        console.log(res)
      that.setData({orderData:res})
      if (that.data.isCollectData){
          that.setData({isCollectData:false})
          let delAllData=res.data.trade
          let orderList=res.data.orderList
          let state=''
          if (delAllData.tradeStatus==54) {
              state='交易关闭'
          }else if (delAllData.tradeStatus==51) {
              state='已取消'
          }else if (delAllData.tradeStatus==2) {
              state='待发货'
          }else if (delAllData.payStatus<2) {
              state='待付款'
          }else if (delAllData.tradeStatus==55) {
              state='已完成'
          }else if (delAllData.tradeStatus<7) {
              state='待收货'
          }
          getApp().tdsdk.event({
              id: '订单详情',
              label: '订单详情',
              params: {
                  g_id:orderList[0].productId,
                  g_name:orderList[0].productName,
                  g_price:orderList[0].memberPrice,
                  g_number:orderList[0].itemNum,
                  g_all_price:orderList[0].itemNum*orderList[0].memberPrice,
                  g_address_city: delAllData.cityName,
                  g_address_area:delAllData.countyName,
                  g_state:state,
                  g_tag:that.data.tag
              }
          });

      }
      if (res.code == 0) {
        if (res.data.orderList[0]){
          if (res.data.orderList[0].isGift == 10) {
            that.setData({ vipindex: true });
          }
        }
        if(res.data.packageList){


        }
        if (res.data.trade.tradeStatus != 51 && res.data.trade.payStatus == 1){
          //that.remainingTime(res.data.time - res.data.trade.createDate)
            that.remainingTime(res.data.trade.expiresTime - res.data.time)
            yd.util.log("TAGK"+(res.data.trade.expiresTime - res.data.time))
        }
        for (let i = 0; i < res.data.orderList.length; i++) {
          res.data.orderList[i].payMoney = yd.util.getPriceDouble(res.data.orderList[i].payMoney)
        }

        res.data.trade.totalMoney = yd.util.getPriceDouble(res.data.trade.totalMoney)
        res.data.trade.totalFreightMoney = yd.util.getPriceDouble(res.data.trade.totalFreightMoney)
        res.data.trade.totalPayMoney = yd.util.getPriceDouble(res.data.trade.totalPayMoney)
        
        res.data.trade.createDate = yd.util.formatTime(res.data.trade.createDate / 1000, 'Y-M-D h:m:s')
        if (res.data.trade.payTime!=null){
          res.data.trade.payTime = yd.util.formatTime(res.data.trade.payTime / 1000, 'Y-M-D h:m:s')
        }
        if (res.data.trade.cancelTime != null) {
          res.data.trade.cancelTime = yd.util.formatTime(res.data.trade.cancelTime / 1000, 'Y-M-D h:m:s')
        }
        // [0].bookDate
        if (res.data.packageList.length && res.data.packageList[0].packageOrders.length && res.data.packageList[0].packageOrders[0].bookDate) {
          let bookDate = yd.util.formatTime(res.data.packageList[0].packageOrders[0].bookDate / 1000, 'Y-M-D  w')
          that.setData({
            bookDate: bookDate 
          })
        } else if (res.data.orderList.length && res.data.orderList[0].bookDate) {
          let bookDate = yd.util.formatTime(res.data.orderList[0].bookDate / 1000, 'Y-M-D  w')
          that.setData({
            bookDate: bookDate
          })
        }
        
        for (let i = 0; i < res.data.packageList.length; i++) {

              yd.ajax({
                  method: 'POST',
                  url: yd.api.getUrl(`/packages/queryTms/${res.data.trade.tradeCode}/${res.data.packageList[i].packages.id}`, 'app')
              }).then(ret => {

                  // for (let i=0;i<res.data.tmsList.length;i++){
                  //
                  // }
                  console.log(ret)
                  if(ret.code==0){
                      res.data.packageList[i].packages.attime= yd.util.formatTime(ret.data.tmsList[i].expressTime / 1000, 'Y-M-D h:m:s')
                    res.data.packageList[i].packages.ataddtext =(ret.data.tmsList[i].remark)? ret.data.tmsList[i].remark :"暂未查询到物流节点信息";
                      res.data.packageList[i].packages.atnumber=ret.data.tmsList[i].tmsStatus;
                  }else{
                      res.data.packageList[i].packages.ataddtext ="暂未查询到物流节点信息";
                  }
                  that.setData({form: res.data})
              }).catch((error) => {
                  console.log('error',  error)
                  res.data.packageList[i].packages.ataddtext ="暂未查询到物流节点信息"
                  that.setData({form: res.data})
              });


              for (let l = 0; l < res.data.packageList[i].packageOrders.length; l++) {
                  res.data.packageList[i].packageOrders[l].payMoney = yd.util.getPriceDouble(res.data.packageList[i].packageOrders[l].payMoney)
              }
          }
          that.setData({ form: res.data });
          console.log(this.data.form)
        if(index){
          that.pay(id)
        }
        
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },
  /**
   * 剩余支付时间
   */
  remainingTime(time1){
    let that = this
    // time = time+''
    // let time1 = 1800-Number(time.substr(0, time.length-3))
      time1=parseInt(time1/1000);
    if (time1<0){
      return
    }
    that.setData({ show: true });
      let second = 0
      if (that.data.timeIndex) {
          clearInterval(that.data.timeIndex)
      }
    that.setData({
      timeIndex: setInterval(function () {
        time1 = time1 - 1
        if (time1 > 0) {
          let time2 = parseInt(time1 / 60)
          let timem=time2
          if (time2 < 10) {
            time2 = '0' + time2
          }
          second = time1 - time2 * 60
          that.setData({
              minute: time2,
              minute1:timem
          });
          if (second < 10) {
            second = '0' + second
          }
          that.setData({ second: second });
        } else {
          that.setData({ show: false });
          clearInterval(that.data.timeIndex)
        }
      }, 1000) });
    
  },
  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1500
        })
      }
    });
  },
  // 取消订单
  cancelOrder:function(e){
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/findMyTrade`, 'app'),
      data: {
        tradeId: e.currentTarget.dataset.item
      }
    }).then(res => {
      if (res.code == 0) {

      } else {

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
    this.orderDetails(this.data.id)    
  },
  /**
   * 去支付的按钮操作
   */
  gopay(e){
    this.pay(e.currentTarget.dataset.id)
  },
  /**
   * 支付
   */
  pay(id){
    let that = this
    that.initGIOPayData()
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/rePayTrade/${id}`, 'app')
    }).then(res => {
      if (res.code == 0) {
        let payData = res.data.payMap;
        wx.requestPayment({
          'timeStamp': payData.timeStamp,
          'nonceStr': payData.nonceStr,
          'package': payData.package,
          'signType': payData.signType,
          'paySign': payData.paySign,
          'success': function (res) {
            that.initGIOPaySuccess();
            that.orderDetails(that.data.id);
            if (that.data.vipindex){
              that.setData({hintNum:1})
            }else{
              let totalMoney = (that.data.form.trade.payCashFee && that.data.form.trade.payCashFee!=0.00)? that.data.form.trade.payCashFee:that.data.form.trade.totalMoney
              wx.navigateTo({
                url: `../../../packagebuy/pages/payresult/payresult?orderId=${that.data.id}&pay=${totalMoney}`,
              })
            }
          },
          'fail': function (res) {
            yd.util.log(res);
            if (res.errMsg!=null&&res.errMsg.indexOf("cancel")!=-1){
                wx.showModal({
                    title: '提示',
                    content: '您的订单在'+that.data.minute1+'分钟内未支付将被取消，请尽快完成支付。',
                    showCancel: false,
                    confirmText: '知道了',
                    success: function (res) {
                    }
                })
            }
            that.unLockPayTrade(id)
          }
        })
      } else {
         res.msg? yd.util.commonToast(res.msg) :"";
      }


    }).catch((error) => {
      console.log('error', error)
    })
  },
  //  清空缓存跳转页面
  clearskip:function(){
      this.setData({hintNum:0});
      yd.oneVip = 2;
      yd.util.clearLocalData('token');
      getApp().login().then(res=>{
          wx.setStorageSync('levelType', 2)
          wx.switchTab({
              url: '/pages/vip/vip',
          })
      })
  },
    //空事件
    kong:function(){},
  initGIOPayData:function(){
      let that=this;
      if (this.data.orderData!=null) {
          let res=this.data.orderData;
          let delAllData = res.data.trade
          let orderList = res.data.orderList
          getApp().tdsdk.event({
              id: '支付详情',
              label: '支付详情',
              params: {
                  g_id: orderList[0].productId,
                  g_name: orderList[0].productName,
                  g_price: orderList[0].memberPrice,
                  g_number: orderList[0].itemNum,
                  g_all_price: orderList[0].itemNum * orderList[0].memberPrice,
                  g_address_city: delAllData.cityName,
                  g_address_area: delAllData.countyName,
                  g_tag: that.data.tag
              }
          });
      }
  },
    initGIOPaySuccess:function(){
       let that=this;
        if (this.data.orderData!=null) {
            let res=this.data.orderData;
            let delAllData = res.data.trade
            let orderList = res.data.orderList;
            getApp().tdsdk.event({
                id: '支付成功',
                label: '支付成功',
                params: {
                    g_id: orderList[0].productId,
                    g_name: orderList[0].productName,
                    g_price: orderList[0].memberPrice,
                    g_number: orderList[0].itemNum,
                    g_all_price: orderList[0].itemNum * orderList[0].memberPrice,
                    g_address_city: delAllData.cityName,
                    g_address_area: delAllData.countyName,
                    g_tag: that.data.tag
                }
            });
        }
    },
  /**
   * 释放锁定支付交易单
   */
  unLockPayTrade(id){
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/unLockPayTrade/${id}`, 'app')
    })
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
    clearInterval(this.data.timeIndex)
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
  
  },
  /**
   * 查看物流
   */
  logistics: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: `../../pages/logistics/logistics?id=${e.currentTarget.dataset.id}&code=${e.currentTarget.dataset.code}`,
    })
  }),
  /**
   * 再次购买
   */
  againBuy: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: '../../../packagebuy/pages/details/details?comid=' + e.currentTarget.dataset.id+"&tag=订单再次购买",
    })
  }),
  /**
   * 确认收货
   */
  receipt(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您是否已收到该订单商品？',
      success: function (res) {
        if (res.confirm) {
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/trade/receivePackage/${e.currentTarget.dataset.item}`, 'app'),
            header: {
              rstoken: that.data.rstoken
              // 'token': 456
            }
          }).then(res => {
            if (res.code == 0) {
              wx.showToast({
                title: '收货成功',
                icon: 'none',
                duration: 1500
              })
              that.orderDetails(that.data.id)
            } else {
              yd.util.commonToast(res.msg)
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }
      }
    })

  },
  /**
   * 取消订单
   */
  clanceOrder(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/trade/cancelTrade/${e.currentTarget.dataset.id}`, 'app')
          }).then(res => {
            if (res.code == 0) {
              wx.showToast({
                title: '订单取消成功',
                icon: 'none',
                duration: 1500
              })
              that.orderDetails(that.data.id)
            }else{
              console.log(res.msg)
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }
      }
    })
  },
    /**
     * 判断vip用户
     */
    isVip: function(that) {
        if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType") > 1) {
            that.setData({
                vipBl: true
            })
        }
    },
  //退款
  refund: function (e) {

    let refunddata = JSON.stringify(e.currentTarget.dataset);
    console.log(refunddata);
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../../pages/refund/refund?refunddata=' + refunddata,
    })
  }
})({
  onPageScroll: true,
  onShow: true
}))
// pages/indent/indent.js
const yd = getApp().globalData;
import {
  Provider
} from '../../../utils/provider.js'
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    rstoken: '',
    isIphoneX: wx.getStorageSync('isIphoneX'),
    addAtData: '',
    timeStatus: 0,
    showTimeBL: false,
    animationData: {},
    judgeAther: true,
    direct: false
  },
  // 地址切换
  addChange: function() {
    wx.navigateTo({
      url: '../manageadd/manageadd',
    })
  },
  // 判断地址
  judge: function(obj) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/goods/checkAddressIsDispatching`, 'app'),
      data: obj
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        let productData = res.data.productData[0]
        if (productData.isDirectDelivery == 1 || that.data.orderdata.isProductareaSend) {
          that.setData({
            dispatching: productData.dispatching,
            comOkNum: productData.storageNum,
            direct: true,
            isDirectDelivery: 1,
          })
        } else {
          if (productData.dateList && productData.dateList.length && !that.data.orderdata.activityId) {
            for (let i = 0; i < productData.dateList.length; i++) {
              productData.dateList[i] = {
                oldtime: productData.dateList[i],
                newtime: yd.util.formatTime(Date.parse(productData.dateList[i]) / 1000, "M月D日  w")
              }
            }
            console.log(productData);
            that.setData({
              productDataTime: productData.dateList,
              dispatching: productData.dispatching,
              comOkNum: productData.storageNum,
              timeStatus: 0,
              isDirectDelivery: 0
            })
          } else {
            // console.log(productData.storageNum)
            that.setData({
              dispatching: productData.dispatching,
              comOkNum: productData.storageNum,
              isDirectDelivery: 0
            })
          }
        }
      } else {

      }
      that.setData({
        judgeAther: false
      })
    }).catch((error) => {})
  },
    /**
     * 判断vip用户
     */
    isVip: function (that) {
        //wx.setStorageSync("levelType", 2)
        if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType") > 1) {
            that.setData({
                vipBl: true
            })
        }
    },
  showChangeTime: function() {
    if (!this.data.addAtData && !this.data.defaultAddress) {
      yd.util.commonToast("请选择收货地址");
      return
    }
    //this.setData({showTimeBL:true});
    getApp().showPop(this, 'showTimeBL', 329, true)
  },
  changeTime: function(e) {
    if (this.data.timeStatus != e.currentTarget.dataset.timestatus) {
      this.setData({
        timeStatus: e.currentTarget.dataset.timestatus
      })
    }
  },
  enterTime: function() {
    //this.setData({showTimeBL:false});
    getApp().cancelPop(this, 'showTimeBL', 329, false)
  },
  kong: function() {

  },
  /**
   * 获取重复提交token
   */
  isrsToken: function() {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/rsToken`, 'app')
    }).then(res => {
      console.log(res);
      if (res.data.code == 0) {
        that.data.rstoken = res.header.rstoken
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },
  // 提交订单
  submitOrder: function() {
    console.log(yd.address);
    let that = this;
    let orderdata = this.data.orderdata;
    let userCode = 0;
    let comOkNum = this.data.comOkNum;
    if (!(yd.address || that.data.defaultAddress)) {
      yd.util.commonToast('请选择收货地址')
      return
    }
    if (comOkNum < 1) {
      yd.util.commonToast('当前地址无货');
      return
    }
    if (comOkNum < orderdata.comNum) {
      yd.util.commonToast('库存不足');
      return
    }
    if (!that.data.dispatching) {
      yd.util.commonToast('当前地址无法配送');
      return
    }
    console.log('abc')
    that.initGIOClickData();
    if (that.data.orderdata.groupId){
    
      let params = {
        groupId: that.data.orderdata.groupId,
        activityId: that.data.orderdata.activityId,
        activityGoodsId: that.data.orderdata.activityGoodsId,
        productId: that.data.orderdata.comId,
        productImg: that.data.orderdata.comImg,
        addressId: (that.data.addAtData)? that.data.addAtData.id : that.data.defaultAddress.id,
        num: that.data.orderdata.comNum,
        cpsUserId: that.data.orderdata.cpsUserId,
        siteId: yd.locaData.siteId
      }
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/group/joinGroup`, 'app'),
        header: {
          rstoken: that.data.rstoken
        },
        data: JSON.stringify(params)
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          let payData = res.data.payMap;
          that.setData({ groupOrderId: res.data.groupOrder.id, groupId: res.data.groupOrder.groupId });
          that.pay(payData)
        } else if(res.code==29019){
          yd.util.commonToast("你已是VIP不能参团");
        }else{
          yd.util.commonToast(res.msg);
        }
      }).catch((error) => {
        console.log('error', error)
      })
    }else if (that.data.orderdata.activityId) {
      let params;
      params = {
        activityId: that.data.orderdata.activityId,
        activityGoodsId: that.data.orderdata.activityGoodsId,
        productId: that.data.orderdata.comId,
        productImg: that.data.orderdata.comImg,
        addressId: (that.data.addAtData) ? that.data.addAtData.id : that.data.defaultAddress.id,
        num: that.data.orderdata.comNum,
        cpsUserId: that.data.orderdata.cpsUserId,
        siteId: yd.locaData.siteId
      }
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/group/openGroup`, 'app'),
        header: {
          rstoken: that.data.rstoken
        },
        data: JSON.stringify(params)
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          let payData = res.data.payMap;
          that.setData({groupOrderId: res.data.groupOrder.id, groupId: res.data.group.id});
          that.pay(payData)
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            confirmText: '我的拼团',
            success: function (res) {
              wx.redirectTo({
                url: '/pageageuser/pages/myspelllist/myspelllist'
              })
            },
            fail: function (res) {
              wx.redirectTo({
                url: '/pageageuser/pages/myspelllist/myspelllist'
              })
            }
          })
        }
      }).catch((error) => {
        console.log('error', error)
      })
    } else {
      let params;
      if (that.data.direct) {
        params = {
          productVoList: [{
            itemNum: orderdata.comNum,
            cpsUser: userCode,
            productId: orderdata.comId,
            shipmentType: 3
          }],
          tradeSource: 1,
          addressId: (that.data.addAtData) ? that.data.addAtData.id : that.data.defaultAddress.id,
        }
      } else {
        if (that.data.productDataTime.length) {
          params = {
            productVoList: [{
              itemNum: orderdata.comNum,
              cpsUser: userCode,
              productId: orderdata.comId,
              bookDate: that.data.productDataTime[that.data.timeStatus].oldtime,
              shipmentType: 3
            }],
            tradeSource: 1,
            addressId: (that.data.addAtData) ? that.data.addAtData.id : that.data.defaultAddress.id,
          }
        } else {
          params = {
            productVoList: [{
              itemNum: orderdata.comNum,
              cpsUser: userCode,
              productId: orderdata.comId,
              shipmentType: 3
            }],
            tradeSource: 1,
            addressId: (that.data.addAtData) ? that.data.addAtData.id : that.data.defaultAddress.id,
          }
        }
      }
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/trade/createTrade`, 'app'),
        header: {
          rstoken: that.data.rstoken
        },
        data: JSON.stringify(params)
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          let orderId = res.data.trade.id;
          let selfEarningsPrice=that.data.orderdata.selfEarningsPrice;
          wx.redirectTo({
            url: `../../../pageageuser/pages/orderdetails/orderdetails?id=${orderId}&pay=1&tag=提交订单页&selfEarningsPrice=${selfEarningsPrice}`,
          })
          yd.userCode = 0
        } else {
          yd.util.commonToast(res.msg)
        }
      }).catch((error) => {
        console.log('error', error)
      })
    }
  },
  pay:function(payDataA) {
    let that = this;
    let payData = payDataA;
    wx.requestPayment({
      'timeStamp': payData.timeStamp,
      'nonceStr': payData.nonceStr,
      'package': payData.package,
      'signType': payData.signType,
      'paySign': payData.paySign,
      success: function(res) {
        wx.redirectTo({
          url: `/packagebuy/pages/spelldel/spelldel?gid=${that.data.groupId}`,
        })
      },
      fail: function(res) {
        yd.util.log(res);
        that.unLockPaySpell(that.data.groupOrderId)
        wx.showModal({
          title: '提示',
          content: '您的订单在10分钟内未支付将被取消，请尽快完成支付。',
          confirmText: '重新支付',
          success: function (res) {
            if(res.confirm){
              that.payAgain(that.data.groupOrderId);
            }else{
              wx.redirectTo({
                url: '/pageageuser/pages/myspelllist/myspelllist'
              })
            }
          },
          fail: function (res) {
            wx.redirectTo({
              url: '/pageageuser/pages/myspelllist/myspelllist'
            })
          }
        })
      }
    })
  },

  payAgain:function(id){
    let that=this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/group/rePayGroupOrder/${id}`, 'app')
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        let payData = res.data.payMap;
        wx.requestPayment({
          'timeStamp': payData.timeStamp,
          'nonceStr': payData.nonceStr,
          'package': payData.package,
          'signType': payData.signType,
          'paySign': payData.paySign,
          success: function (res) {
            wx.showLoading({
              title: '拼团成功',
            })
            setTimeout(function () {
              wx.hideLoading();
              wx.redirectTo({
                url: `/packagebuy/pages/spelldel/spelldel?gid=${that.data.groupId}`,
              })
            }, 2000);
          },
          fail: function (res) {
            that.unLockPaySpell(that.data.groupOrderId);
            wx.redirectTo({
              url: `/pageageuser/pages/myspelllist/myspelllist`,
            })
          }
        })
      } else {
        yd.util.commonToast(res.msg);
        wx.redirectTo({
          url: '/pageageuser/pages/myspelllist/myspelllist'
        });
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },

  // 拼团订单接触锁定
  unLockPaySpell:function(id) {
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/group/unLockPayGroupOrder/${id}`, 'app')
    }).then(res => {
    }).catch((error) => {
      console.log("error", error)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let orderdata = JSON.parse(options.orderdata);
    console.log(orderdata)
    this.isrsToken()
    let money = yd.util.getPriceDouble(orderdata.comNum * orderdata.comPrice)
    that.setData({
      orderdata: orderdata,
      money: money
    });
    yd.util.log(orderdata)
    // 关闭分享 
    wx.hideShareMenu();
    // 获取手机信息
    this.isVip(this);
  },
  initGIO2Data: function() {
    let delAllData = this.data.orderdata;
      getApp().tdsdk.event({
          id: '确认订单-到访',
          label: '确认订单-到访',
          params: {
              g_id: delAllData.comId,
              g_name: delAllData.comName,
              g_price: delAllData.comPrice,
              g_number: delAllData.comNum
          }
      });
  },
  initGIOClickData: function() {
    let delAllData = this.data.orderdata;
      getApp().tdsdk.event({
          id: '确认订单-提交订单',
          label: '确认订单-提交订单',
          params: {
              g_id: delAllData.comId,
              g_name: delAllData.comName,
              g_price: delAllData.comPrice,
              g_number: delAllData.comNum,
              g_all_price: delAllData.comNum * delAllData.comPrice
          }
      });
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
    let that = this;
    let orderdata = this.data.orderdata;
    let defaultAddress = wx.getStorageSync('defaultAddress')
    console.log(defaultAddress)
    if (yd.address && orderdata) {
      that.setData({
        addAtData: yd.address
      })
      let param = {
        param: {
          areaCode: yd.address.cityCode,
          countyAreaCode: yd.address.nationalCode,
          productData: [{
            goodsId: orderdata.comId
          }]
        }
      }
      that.judge(param);
    } else if (defaultAddress && orderdata) {
      that.setData({
        defaultAddress: defaultAddress
      })
      let param = {
        param: {
          areaCode: defaultAddress.cityCode,
          countyAreaCode: defaultAddress.nationalCode,
          productData: [{
            goodsId: orderdata.comId
          }]
        }
      }
      that.judge(param);
    }
    this.initGIO2Data()
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
// pageageuser/pages/refund/refund.js
const yd = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selshow: false,
    select: [{
        text: '不想买了'
      },
      {
        text: '重复下单'
      },
      {
        text: '其他渠道价格更低'
      },
      {
        text: '其他原因'
      }
    ],
    isIphoneX: wx.getStorageSync('isIphoneX')
  },
  //打开选择弹框
  openshow: function() {
    this.setData({
      selshow: true
    })
  },
  //选择退款条件
  select: function(e) {
    (this.data.sindex == e.currentTarget.dataset.sindex) ? '' : this.setData({
      sindex: e.currentTarget.dataset.sindex
    })
  },
  //关闭条件选择
  choseshow: function() {
    this.setData({
      selshow: false
    })
  },
  //不弹弹框确定
  enter1: function() {
    (this.data.sindex >= 0) ? this.enterajax(): yd.util.commonToast('请选择退款原因')
  },
  //弹弹框确认
  enter2: function() {
    (this.data.sindex >= 0) ? this.setData({
      selshow: false
    }): yd.util.commonToast('请选择退款原因')
  },
  //确认ajax
  enterajax: function() {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/returns/applyCancel`, 'app'),
      data: {
        cancelReason: that.data.select[that.data.sindex].text,
        tradeCode: that.data.refunddata.tradeid
      }
    }).then(res => {
      if (res.code === 0) {
        // yd.util.commonToast('成功提交退款申请')
        wx.redirectTo({
          url: '../../pages/aftersale/aftersale',
          success:function(){
            yd.util.commonToast('提交退款申请成功')
          }
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    if (options.refunddata) {
      //如果有传值的话给转化为对象
      let refunddata = JSON.parse(options.refunddata);
      console.log(options.refunddata);
      //把对象渲染到面中去
      this.setData({
        refunddata: refunddata
      });
    }
    
    console.log(this.data.refunddata.tradeId)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
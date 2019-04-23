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
  },
  // 时时监听
  timelygettext:function(e){
    console.log(e)
    this.setData({ attext: e.detail.value, timely:true});
  },
  // 脱离焦点监听
  gettext:function(e){
    console.log(e)
    this.setData({ attext: e.detail.value});
  },
  // 软键盘确认
  clicksearch2:function(e){
    console.log(e);
    let attext = e.detail.value
    if(!attext) {
      (e.detail.value)? this.setData({attext: '' }) : '';
      yd.util.commonToast("请输入手机号");
      return
    }
    this.setData({ partnerList: "", attext: attext, hasNextPage:true})
    this.getList()
  },
  // 点击按钮确认
  formSubmit: function (e) {
    //无搜索内容提示
    console.log(e)
    let attext = e.detail.value.input
    if (!attext) {
      (e.detail.value.input)? this.setData({ attext: '' }) : '';
      yd.util.commonToast("请输入手机号");
      return
    }
    this.setData({ partnerList: "", attext: attext, hasNextPage:true});
    this.getList();
  },
  // 取消  
  cancelInput:function(){
      this.setData({attext:''})
  },
  // 去个人
  gomemberdel: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: `/packagepower/pages/memberdel/memberdel?teamUserId=${e.currentTarget.dataset.userid}&lasttime=${e.currentTarget.dataset.lasttime}`,
    })
  }),
  deleteinput:function(){
    this.setData({attext:''});
    this.getList();
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
          mobile: Number(this.data.attext)
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
  onLoad: function (options) {
    wx.hideShareMenu();
    this.getList();
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})({
  onPageScroll: true
}))
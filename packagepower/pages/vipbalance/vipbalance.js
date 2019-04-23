// packagepower/pages/vipbalance/vipbalance.js
import { Provider } from '../../../utils/provider.js'
const yd = getApp().globalData
Page(Provider({ 

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    barData:[{
        types: 0,
        name: "全部"
      },
      {
        types: 1,
        name: "收入"
      },
      {
        types: 2,
        name: "支出"
      },
    ],
    attype:0,
    hasNextPage:true
  },
  // 提现 
  getMoney(e){
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/manage/data/queryByCodeType/self_purchase_switch`, 'app')
    }).then(res => {
      if (res.data[0].value==1){
          yd.ajax({
              method: 'GET',
              url: yd.api.getUrl(`/manage/data/queryByCodeType/customer_service`, 'app'),
              header: {
                  token: wx.getStorageSync('token')
              },
          }).then(res => {
              wx.navigateTo({
                  url: '/packagepower/pages/newwebview/newwebview?webview=' + res.data[0].value,
              })
              // console.log(res.data[0].value)
          })
      }else {
          yd.util.commonToast("提现功能正在开发中  敬请期待~")
      }
    })
  },
  // bar选择
  barChane:function(e){
    let that=this;
    let [attype, status] = [this.data.attype, e.currentTarget.dataset.status];
   if(attype === status){
    
   } else{
     that.setData({ balanceList: '', hasNextPage: true })
     that.getList(status)
     };

  },
  getAllMoney() {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/profit/vip/index`, 'app')
      // 暂时使用假数据 
    }).then(res => {
      console.log(res)
      if(res.code==0){
        let allmoney = (res.data.availableAmount) ? yd.util.getPriceDouble(res.data.availableAmount) : "0.00";
        that.setData({ allMoney: allmoney });
      }
      
    }).catch((error) => {
      // wx.stopPullDownRefresh()
    })
  },
  getList: function (status = this.data.attype){
    let that = this;
    if (that.data.hasNextPage){
      yd.util.loading();
      let urls;
      switch (status) {
        case 0:
          urls = '/user/accountMoney/index'
          break;
        case 1:
          urls = '/user/accountMoney/incomeList'
          break;
        case 2:
          urls = '/user/accountMoney/expenditure'
          break;
      }

      let balanceListNum = (that.data.balanceList)? (that.data.balanceList.length + 1) : 1;
      let balanceListIndex = balanceListNum - 1;
        let balanceList = (that.data.balanceList)? that.data.balanceList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`${urls}`, 'app'),
        header: {
          token: wx.getStorageSync("token")
        },
        data: {
          pageNum: balanceListNum,
          pageSize: 10
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading();
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].createDate = yd.util.formatTime(res.data.list[i].createDate / 1000, 'Y-M-D h:m:s');
            res.data.list[i].money = yd.util.getPriceDouble(res.data.list[i].money);
          };
          balanceList[balanceListIndex] = res.data.list;
          let idIndex = "id" + balanceListIndex;
          that.setData({
            balanceList: balanceList,
            hasNextPage: res.data.hasNextPage,
            idIndex: idIndex,
            attype: status
          })
        }
        console.log(res.data.hasNextPage)
      }).catch((error) => {
        wx.hideLoading();
      })
    }else{
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.hideShareMenu()
    // let allmoney =(options.allmoney)? yd.util.getPriceDouble(options.allmoney):"0.00";
    // this.setData({ allMoney: allmoney});
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
    let that =this;
    this.getList(that.data.attype);
    this.getAllMoney();
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
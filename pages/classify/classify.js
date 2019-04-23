//pages/classify/classify.js
// 分类列表
// 继承ajax请求');
import {
  Provider
} from '../../utils/provider.js'
const yd = getApp().globalData;
//import $bus from "../../utils/eventbus.js"
import pagestates from '../../utils/pagestates/pagestates.js'
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    vipBl: false,
    orderidJudg: 2,
    hasNextPage: true,
    selectId: 0,
    listCode: {
      pageSize: 10, //总额数
      pageNum: 1, // 第几页
      param: {
        cateroryId: 1, //分类
        sortType: 0,
        siteId: 1,
        orderBy: 2
      }
    },
    conditonO: [{
        typeid: 0,
        name: '默认',
        index: 1
      },
      {
        typeid: 1,
        name: '销量',
        index: 2
      },
      {
        typeid: 2,
        name: '价格',
        index: 3
      }
    ],
    conditonT: [{
        typeid: 0,
        name: '默认',
        index: 1
      },
      {
        typeid: 3,
        name: '返现比例',
        index: 2
      },
      {
        typeid: 1,
        name: '销量',
        index: 3
      },
      {
        typeid: 2,
        name: '价格',
        index: 4
      }
    ]
  },
  // 渲染banr
  getbar() {
    yd.ajax({
      method: 'get',
      url: yd.api.getUrl(`/productCaterory/findRootsByFront`, 'app')
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setData({
          scrollRoots: res.data
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },
  // bar选择
  selectClass: function(e) {
    let that = this;
    let numRoots = that.data.scrollRoots.length;
    let intoId;
    let atnumber = e.currentTarget.dataset.getindex;
    if (numRoots > 8) {
      if (atnumber > 4 || atnumber < (numRoots - 3)) {
        intoId = 'ID' + (atnumber - 1)
      }
    } else {
      intoId = 'ID' + atnumber 
    }
    that.data.listCode.param.cateroryId = e.currentTarget.dataset.atid;
    that.data.listCode.param.sortType = 0;
    that.data.listCode.param.orderBy = 2;
    that.setData({
      listCode: that.data.listCode,
      intoId: intoId,
      selectId: atnumber,
      hasNextPage: true,
      comSList: ""
    });
    that.getComList()
  },
  // 商品跳转
  delSkip:yd.util.notDoubleClick( function() {
    let comid = e.currentTarget.dataset.comid;
    
    wx.navigateTo({
      url: '../../packagebuy/pages/details/details?comid=' + comid+"&tag=分类页",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }),
  // 条件选择
  conditonClick: function(e) {
    let that = this;
    let listCode = that.data.listCode;
    let sortType = e.currentTarget.dataset.typeid;
    let numJudg = listCode.param.sortType;
    let orderid = listCode.param.orderBy;
    if (sortType === numJudg) {
      if (sortType === 0) {
        console.log("已经是默认了");
      } else {
        if (orderid === 2) {
          orderid = 0;
        } else if (orderid === 0) {
          orderid = 1;
        } else if (orderid === 1) {
          orderid = 0;
        }
        listCode.param.orderBy = orderid;
        that.setData({
          listCode: listCode,
          hasNextPage: true,
          comSList: ""
        });
        that.getComList()
      }
    } else {
      orderid = 0;
      listCode.param.sortType = sortType;
      listCode.param.orderBy = orderid;
      that.setData({
        listCode: listCode,
        hasNextPage: true,
        comSList:""
      });
      that.getComList();
    }


  },
  // 获取商品列表
  getComList: function (empty=1) {
    let that = this;
    if (that.data.hasNextPage) {
      let comList = this.data.listCode;
      comList.param.siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
      comList.param.sortType = (comList.param.sortType === 4) ? '' : comList.param.sortType;
      comList.param.orderBy = (comList.param.orderBy === 2) ? '' : comList.param.orderBy;
      comList.pageNum = (that.data.comSList)? (that.data.comSList.length + 1) : 1;
      let pagesNumA = comList.pageNum - 1;
      let comSList = (that.data.comSList)? that.data.comSList : new Array();
      let pageState = pagestates(this)
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/goods/listByCateroryId`, 'app'),
        data: comList
      }).then(res => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        console.log(res)
        if (res.code === 0) {
          comSList[pagesNumA] = res.data.list
          let idindex = 'comid'+ pagesNumA;
          this.setData({
            comSList: comSList,
            hasNextPage: res.data.hasNextPage,
            idindex: idindex
          })
        } else {
          res.msg ? yd.util.commonToast(res.msg) : ''
        }
    
      }).catch((error) => {
        pageState.error()
        console.log('error', error)
      })
    } else {
      console.log()
    }
  },
  // 商品跳转
  detSkip: function(e) {
    let comid = e.currentTarget.dataset.comid;
    wx.navigateTo({
      url: '../../packagebuy/pages/details/details?comid=' + comid+"&tag=分类页",
    })
  },
  /**
   * 判断vip用户
   */
  isVip: function(that) {
    if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType")>1) {
      that.setData({
        vipBl: true
      })
    }
  },
  /**
   * 初始化默认选项
   */
  // initData(that) {
  //     that.data.listCode.param.sortType = 0;
  //     that.data.selectId = 1;
  //     that.setData({ listCode: that.data.listCode, selectId: that.data.selectId });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.hideShareMenu()
    //$bus.$emit("toast", "分类页发送信息");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getbar();
    this.getComList();
    this.isVip(this);
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
    wx.showNavigationBarLoading();//在标题栏中显示加载
    this.setData({
      hasNextPage: true,
      comSList:""
    })
    this.getComList()
  },
  onRetry: function () {
    this.getbar();
    this.getComList();
    this.isVip(this);
    let pageState = pagestates(this)
    pageState.finish()
  },
  goInfo: function () {
    wx.navigateTo({
      url: '/packagepower/pages/retryinfo/retryinfo',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getComList()
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
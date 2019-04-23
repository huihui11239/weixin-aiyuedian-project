// pages/home/home.js
// 首页
import {
  Provider
} from '../../utils/provider.js'
const yd = getApp().globalData;
import $bus from "../../utils/eventbus.js"
import pagestates from '../../utils/pagestates/pagestates.js'
// 获取全局
Page(Provider({
  /**
   * 页面的初始数据
   */
  data: {
    trues: 'ture',
    hasNextPage: true,
    vipBl: false,
    isInvated: false,
    call: '',
    isTabBl: true,
    phoneWidtd: wx.getSystemInfoSync().windowWidth,
    limitData: [],
    timelist: [],
    timeIndex: "",
    isIphoneX: wx.getStorageSync('isIphoneX'),
    isIOS: wx.getStorageSync('isIOS'),
    isFirstLoad:true
  },
  goSpellList:function(){
    wx.navigateTo({
      url: '/packagebuy/pages/spelllist/spelllist',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onTabItemTap(item) {
    if (this.data.isTabBl) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      this.setData({
        isTabBl: true
      })
    }
  },
  // 定位跳转
  locaSkip: function() {
    wx.navigateTo({
      url: '/packagepower/pages/location/location',
    })
  },
  // 商品跳转
  detSkip: yd.util.notDoubleClick(function(e) {
    let comid = e.currentTarget.dataset.comid;
    let tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: '/packagebuy/pages/details/details?comid=' + comid + "&tag=" + tag,
      complete: function(res) {},
    })
    // wx.navigateTo({
    //   url: '../../pageageuser/pages/jointeam/jointeam',
    // })
  }),
  //搜索
  search: yd.util.notDoubleClick(function() {
    // yd.util.commonToast("搜索功能正在开发中 敬请期待")
    // 搜索功能待开发中
    wx.navigateTo({
      url: '../../packagebuy/pages/searchresult/searchresult',
    })
  }),
  //轮播图点击
  bannerClick: yd.util.notDoubleClick(function(e) {
    let item = e.target.dataset.item;
    switch (Number(item.mode)) {
      case 1:
        yd.util.log(item.whitherUq)
        wx.navigateTo({
          url: '../../packagebuy/pages/details/details?comid=' + item.whitherUq + "&tag=首页banner",
        })
        break;
      case 2:
        yd.util.log(item.linkUrl)
        if (
          item.linkUrl.indexOf("/pages/vip/vip") != -1 ||
          item.linkUrl.indexOf("/pages/home/home") != -1 ||
          item.linkUrl.indexOf("/pages/mine/mine") != -1 ||
          item.linkUrl.indexOf("/pages/classify/classify") != -1
        ) {
          //不等于-1表示该字符串包含子字符串。
          wx.switchTab({
            url: item.linkUrl
          })
        } else {
          wx.navigateTo({
            url: item.linkUrl,
            success: function(res) {},
            fall: function(res) {},
            complete: function(res) {},
          })
        }
        break;
    }
  }),
  // 获取轮播图
  banner: function() {
    let that = this;
    let pageState = pagestates(this)
    let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/home/ad/list/10001/${siteId}`, 'app')
    }).then(res => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      yd.util.log(res)
      if (res.code === 0) {
        this.setData({
          banner: res.data
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
      console.log('error', error)
      pageState.error()
    })
  },
  initLimit: function() {
    let that = this;
    if (that.data.timeIndex) {
      clearInterval(that.data.timeIndex)
    }
    that.limitTime();
  },
  limitTime: function() {
    let that = this;
    let pageState = pagestates(this)
    let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/home/activity/location/1/${siteId}/black_friday`, 'app')
    }).then(res => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      yd.util.log(res)
      if (res.code == 0) {
        if (res.data && res.data.activity) {
          that.setData({
            limitData: res.data.activity.activityGoodsDTOList,
            limitTimeS: res.data.activity.surplusDate,
            limitAll: res.data
          });
          that.limitTimeCount();
          yd.util.log("疯狂星期五" + res.data.activity.activityGoodsDTOList);
        } else {
          that.setData({
            limitData: []
          });
        }
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
      console.log('error', error)
      //pageState.error()
    })
  },
  // 专题获取
  watchSpecial: function() {
    let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/goods/selectionHotGoodsList/${siteId}`, 'app')
    }).then(res => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      console.log(res)
      if (res.code === 0) {
        this.setData({
          twoList: res.data.list
        });
      } else {
        this.setData({
          twoList: ""
        });
      }
    }).catch((error) => {
      this.setData({
        twoList: ""
      });
    })
  },
  //获取新品上市
  newGoods: function() {
    let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/goods/selectionNewGoodsList/${siteId}`, 'app')
    }).then(res => {
      yd.util.log("获取到新品上市")
      if (res.code === 0) {
        this.setData({
          oneList: res.data.list
        });
      } else {
        this.setData({
          oneList: ""
        });
      }
    }).catch((error) => {
      this.setData({
        oneList: ""
      });
    })
  },
  // 瀑布流
  falls: function() {
    let that = this;

    if (that.data.hasNextPage) {
      // if(open="on"){

      // }else{}
      let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
      let pagesNum = (this.data.fallsList) ? (this.data.fallsList.length + 1) : 1;
      let pagesNumA = pagesNum - 1;
      let fallsList = (this.data.fallsList) ? this.data.fallsList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/goods/selectionGoodsList`, 'app'),
        data: {
          pageNum: pagesNum,
          pageSize: 10,
          param: siteId
        }
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          //res.data.goods = yd.util.serverPriceDouble(res.data.goods)
          fallsList[pagesNumA] = res.data.list;
          let idindex = "comid" + pagesNumA;
          that.setData({
            fallsList: fallsList,
            hasNextPage: res.data.hasNextPage,
            idindex: idindex,
          })
        } else {
          // res.msg ? yd.util.commonToast(res.msg) : ''
        }
      }).catch((error) => {})
    } else {

    }
  },

  /**
   * 判断vip用户
   */
  isVip: function(that) {
    //wx.setStorageSync("levelType", 2)
    if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType") > 1) {
      that.setData({
        vipBl: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  initData: function(that) {
    let local = false
    getApp().locaFunc().then(res => {
      local = true
      let {
        siteId,
        area: {
          areaName,
          areaCode,
        }
      } = res.data;
      let locaDataA = {
        siteId,
        areaName,
        areaCode,
      };
      let locaDataB = wx.getStorageSync('locaData');
      if (locaDataB) {
        if (locaDataA.areaCode === locaDataB.areaCode) {
          yd.locaData = locaDataA;
          that.setData({
            locaData: locaDataA,
            hasNextPage: true,
            fallsList: ''
          });
          that.banner();
          that.initLimit();
          that.newGoods();
          that.watchSpecial(10002);
          that.falls();
        } else {
          wx.showModal({
            title: '提示',
            content: `是否切换为当前定位城市:${locaDataA.areaName}`,
            success: function(res) {
              if (res.confirm) {
                yd.locaData = locaDataA;
                wx.setStorageSync('locaData', locaDataA)
                that.setData({
                  locaData: locaDataA,
                  hasNextPage: true,
                  fallsList: ''
                });
                that.banner();
                that.initLimit();
                that.newGoods();
                that.watchSpecial(10002);
                that.falls();
              } else if (res.cancel) {
                yd.locaData = locaDataB;
                that.setData({
                  locaData: locaDataB,
                  hasNextPage: true,
                  fallsList: ''
                });
                that.banner();
                that.initLimit();
                that.newGoods();
                that.watchSpecial(10002);
                that.falls();
              }
            }
          })
        }
      } else {
        yd.locaData = locaDataA;
        that.setData({
          locaData: locaDataA,
          hasNextPage: true,
          fallsList: ''
        });
        that.banner();
        that.initLimit();
        that.newGoods();
        that.watchSpecial(10002);
        that.falls();
      }

    }).catch((res) => {
      local = true
      yd.util.commonToast("启用默认位置")
      yd.locaData = {
        siteId: 1,
        areaName: "北京市",
        areaCode: "110100"
      }
      that.setData({
        locaData: yd.locaData,
        hasNextPage: true,
        fallsList: ''
      });
      that.banner();
      that.initLimit();
      that.newGoods();
      that.watchSpecial(10002);
      that.falls();
    });
    setTimeout(function() {
      if (!local) {
        yd.locaData = {
          siteId: 1,
          areaName: "北京市",
          areaCode: "110100"
        }
        that.setData({
          locaData: yd.locaData,
          hasNextPage: true,
          fallsList: ''
        });
        that.banner();
        that.initLimit();
        that.newGoods();
        that.watchSpecial(10002);
        that.falls();
      }
    }, 2000)
  },
  /**
   * 事件总线Demo
   */
  initEvent: function() {
    this.setData({
      call: (text) => {
        console.log(text);
      }
    })
    //$bus.$on("toast", this.data.call);
  },
  // 声明周期
  onLoad: function(options) {

   
    console.log(yd.oneVip)
    let that = this;
    let locaData = wx.getStorageSync("locaData");

    // wx.navigateTo({
    //   url: '../../packagebuy/pages/sharespell/sharespell?sukId=447&qrcode=&img=https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJHtl9iaBdrT0uaicMPH5APWJ0Oh091KghXhia6ZMlicicEhwqlib9u74l6nenDqIuSy17E7glGoLYGA6GQ/132'
    // })

    that.setData({
      locaData: locaData
    });
    that.initData(this);
    that.initEvent();
    that.getPopNumber();
    // 2018-9-4 jinjinjin 获取点击数量
    if (options.label && options.msgId) {
      getApp().statisticsClick(options.label, options.msgId)
    }
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
    if (yd.locaChane) {
      this.setData({
        locaData: yd.locaData,
        hasNextPage: true,
        fallsList: ''
      });
      this.banner();
      this.newGoods()
      this.watchSpecial(10002);
      this.falls();
    } else {}
    this.data.isFirstLoad?this.setData({isFirstLoad:false}):this.initLimit();
    this.isVip(this)
    // this.checkUserData()
    console.log(this.data.isIphoneX)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this
    this.setData({
      isTabBl: false
    })
    yd.locaChane = false;
    if (this.data.timeIndex) {
      clearInterval(that.data.timeIndex)
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //$bus.$off("toast", this.data.call)
    if (this.data.timeIndex) {
      clearInterval(this.data.timeIndex)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.initData(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("ddd")
    this.falls();
  },
  onRetry: function() {
    this.initData(this)
    let pageState = pagestates(this)
    pageState.finish()
  },
  goInfo: function() {
    wx.navigateTo({
      url: '/packagepower/pages/retryinfo/retryinfo',
    })
  },

  getPopNumber: function() {
    let that = this;
    getApp().popNumber().then(res => {
      if (res.data.unpay != 0 || res.data.unreceive != 0 || res.data.unsend != 0) {
        wx.showTabBarRedDot({
          index: 3
        })
      } else {
        wx.hideTabBarRedDot({
          index: 3,
        })
      }
    })
  },
  /**
   * 限时限购倒计时
   */
  limitTimeCount() {
    let browTime = 0;
    let that = this;
    if (that.data.timeIndex) {
      clearInterval(that.data.timeIndex)
    }
    //初始化时间戳
    that.initLimitTime(browTime);
    //启动定时器
    that.setData({
      timeIndex: setInterval(function() {
        browTime = browTime + 1;
        that.initLimitTime(browTime)
      }, 1000)
    });
  },
  initLimitTime(browTime) {
    let that = this;
    let limitTime = that.data.limitTimeS;

    let time1 = limitTime - browTime
    if (time1 > 0) {
      let day = parseInt(time1 / 86400)
      let hour = parseInt((time1 - day * 86400) / 3600)
      if (hour < 10) {
        hour = '0' + hour
      }
      let minute = parseInt((time1 - day * 86400 - hour * 3600) / 60)
      if (minute < 10) {
        minute = '0' + minute
      }
      let second = parseInt((time1 - day * 86400 - hour * 3600 - minute * 60))
      if (second < 10) {
        second = '0' + second
      }
      // let msecond = time1 - day * 864000 - hour * 36000 - minute * 600 - second * 10
      // if (msecond < 10) {
      //     msecond = '0' + msecond
      // }
      that.setData({
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        //msecond: msecond
      })
    } else {
      that.initLimit();
      return
    }

  },
  timeDetail: yd.util.notDoubleClick(function() {
    wx.navigateTo({
      url: "../../packagepower/pages/limittime/limittime"
    })
  }),

  remove: function(a, obj) {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        a.splice(i, 1)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: 'pages/home/home'
    }
  }
})({
  onPageScroll: true,
  onShow: true
}))
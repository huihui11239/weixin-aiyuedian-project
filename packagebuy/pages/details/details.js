// pages/details/details.js
// 详情
const yd = getApp().globalData;
const api = getApp()
import {
  Provider
} from '../../../utils/provider.js'
const util = require('../../../utils/util.js')
import pagestates from '../../../utils/pagestates/pagestates.js'
const easyCanvas = require('../../../easyCanvas/easyCanvas.js');
Page(Provider({
  /**
   * 页面的初始数据
   */
  data: {
    shareBoxBl: true,
    animationData: {},
    shopboxBl: true,
    comNum: 1,
    vipBl: false,
    userinfo: wx.getStorageSync('firstOne'),
    delAllData: {
      product_area: ""
    },
    user: {},
    isIphoneX: wx.getStorageSync('isIphoneX'),
    qrCode: null,
    qrCodePath: null,
    isShowVIP: false,
    tag: "默认",
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    time: 0,
    isTimeActivity: false,
    addressCode: null,
    isDrawSuccess: false,
    buyNumber: 99999,
    moreQuality: false,
    isAutoSave: false,
    statusFlag: -1,
    dispatching: true,
    openSpellBuy: false,
    spellNumber: 0,
    isDirectDelivery: 0,
    saveNumber: "",
    totalNumber: "",
    comOkNum: "",
    spellBackBl: false
  },
  // 拼团说明
  spellState: function() {
    wx.navigateTo({
      url: '/packagebuy/pages/spellstate/spellstate',
    })
  },
  goSpellList: function() {
    wx.navigateTo({
      url: '/packagebuy/pages/spelllist/spelllist,',
    })
  },
  // 打开分享
  openShare: function() {

  },
  //春播安心的滑动
  getQuality: function(id) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/manage/product/getProductQuality/${id}`, 'app')
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        let QualityArr = new Array();
        if (res.data.virtual_quality) {
          QualityArr = res.data.virtual_quality
        } else if (res.data) {
          QualityArr.push(res.data);
        }
        that.setData({
          QualityArr: QualityArr
        })
      } else {

      }
    }).catch((error) => {

    })
  },
  //品控查看更多
  sMoreQuality: function() {
    this.setData({
      moreQuality: true
    })
  },

  sMoreQuality1: function() {
    let that = this;
    if (that.data.moreQuality) {
      that.setData({
        moreQuality: false
      })
    } else {
      that.setData({
        moreQuality: true
      })
    }
  },
  //品控查看更多收起
  hMoreQuality: function() {
    this.setData({
      moreQuality: false
    })
  },
  //品控跳转
  skipQuality: function(e) {
    if (e.currentTarget.dataset.list.length) {
      let list = JSON.stringify(e.currentTarget.dataset.list);
      wx.navigateTo({
        url: `../quality/quality?list=${list}&title=${e.currentTarget.dataset.title}`
      })
    } else if (e.currentTarget.dataset.url) {
      let url = e.currentTarget.dataset.url
      console.log(url)
      wx.navigateTo({
        url: `/packagepower/pages/newwebview/newwebview?webview=${url}`,
      })
    }
  },
  // 获取商品所有信息
  getAllData: function(id, isLoad = true) {
    if (isLoad) {
      yd.util.loading("加载中", true);
    }
    let that = this;
    let sukid = id;
    let pageState = pagestates(this)
    let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/goods/detailById/${sukid}/${siteId}`, 'app')
    }).then(res => {
      pageState.finish()
      wx.hideLoading();
      console.log(res);
      if (res.code === 0) {
        that.getGoodImg(res.data);
        that.getQuality(res.data.product_info.thirdProductId)
        console.log(res);
        res.data.product_info.marketPrice = res.data.product_info.marketPrice;
        res.data.product_info.sellPrice = Number(yd.util.getPriceDouble(res.data.product_info.sellPrice))
        console.log(res.data.product_info.marketPrice)
        console.log(res.data.product_info.sellPrice)
        res.data.product_info.saveMoney = yd.util.getPriceDouble(res.data.product_info.marketPrice - res.data.product_info.sellPrice)
        res.data.product_info.shareEarningsPrice = yd.util.getPriceDouble(res.data.product_info.shareEarningsPrice)
        res.data.product_info.selfEarningsPrice = yd.util.getPriceDouble(res.data.product_info.selfEarningsPrice)
        // let comOkNum = res.data.product_storage.shareStorageNum - res.data.product_storage.lockStorageNum - res.data.product_storage.safeStorageNum;
        let addressArr = res.data.product_area;
        let article = res.data.deatil_descImg[0].detailValue;
        try {
          yd.WxParse.wxParse('article', 'html', article, that, 12);
        } catch (err) {
          yd.util.commonToast(err)
        }
        //
        // 地址历变匹配
        let param = {
          param: {
            areaCode: "",
            productData: [{
              goodsId: res.data.product_info.id
            }]
          }
        }
        // let addressArr = (that.data.delAllData.product_area)? that.data.delAllData.product_area : '';
        let defaultAddress = wx.getStorageSync("defaultAddress");
        if (res.data.product_info.id && yd.address) {
          console.log(yd.address);
          let address = yd.address;
          let addresstext = address.city + "  " + address.area + " " + address.street;

          that.setData({
            addresstext: addresstext,
            addressData: yd.address
          });
          param.param.areaCode = yd.address.cityCode;
          param.param.countyAreaCode = yd.address.nationalCode;
          that.judge(param);
        } else if (res.data.product_info.id && defaultAddress) {
          console.log(defaultAddress);
          let addresstext = defaultAddress.city + "  " + defaultAddress.area + " " + defaultAddress.street;
          that.setData({
            addresstext: addresstext,
            defaultAddress: defaultAddress
          });
          param.param.areaCode = defaultAddress.cityCode;
          param.param.countyAreaCode = defaultAddress.nationalCode;
          that.judge(param)
        } else if (res.data.product_info.id && yd.locaData) {
          console.log(yd.locaData)
          let addresstext = yd.locaData.areaName;
          that.setData({
            addresstext: addresstext,
            addLocaText: yd.locaData,
          });
          param.param.areaCode = yd.locaData.areaCode;
          that.judge(param)
        }
        if (res.data.activityGoods != null) {
          that.setData({
            isTimeActivity: true
          })
          that.limitTime(res.data.activityGoods.surplusDate);
          yd.util.log("结束时间" + res.data.activityGoods.endDate)
          let btimelong = res.data.activityGoods.endDate / 1000 - res.data.activityGoods.startDate / 1000;
          let btime = '';
          if (btimelong > 86400) {
            btime = '仅' + parseInt(btimelong / 86400) + '天'
          } else if (btimelong > 3600) {
            btime = '仅' + parseInt(btimelong / 3600) + '小时'
          } else {
            btime = '仅' + parseInt(btimelong / 60) + '分钟'
          }
          console.log(res.data.product_info.sellPrice)
          if (res.data.activityGoods.statusFlag == 1 && res.data.activityGoods.type == '1') {
            let nprice = res.data.product_info.discountPrice;
            res.data.product_info.sellPrice = nprice;
          }
          let startTime = yd.util.formatTime(res.data.activityGoods.startDate / 1000, 'M月D日 h:m');
          that.setData({
            btime: btime,
            startTime: startTime,
            statusFlag: res.data.activityGoods.statusFlag
          });
        } else {
          if (that.data.timeIndex) {
            clearInterval(that.data.timeIndex)
          }
          that.setData({
            time: 0,
            statusFlag: -1
          });
        }
        that.setData({
          delAllData: res.data,
          addressCode: param.param.areaCode,
          comNum: 1
        });
        that.initGIOData();
      } else {
        that.setData({
          delAllData: res.data,
          comNum: 1
        });
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
      that.setData({
        saveNumber: yd.util.getPriceDouble(that.data.delAllData.product_info.selfEarningsPrice * that.data.comNum),
        totalNumber: yd.util.getPriceDouble(that.data.delAllData.product_info.sellPrice * that.data.comNum)
      })

    }).catch((error) => {
      wx.hideLoading();
      console.log('error', error)
      pageState.error()
    })
  },
  // 判断地址
  judge: function(obj) {
    // console.log(res)
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/goods/checkAddressIsDispatching`, 'app'),
      data: obj
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        let judgedata = res.data.productData[0]
        if (judgedata.isDirectDelivery == 1) {
          that.setData({
            promiseTitle: judgedata.promiseTitle,
            comOkNum: judgedata.storageNum ? judgedata.storageNum : 0,
            dispatching: judgedata.dispatching,
            isDirectDelivery: judgedata.isDirectDelivery
          })
        } else {
          that.setData({
            comOkNum: judgedata.storageNum? judgedata.storageNum:0,
            dispatching: judgedata.dispatching,
            promiseTitle: judgedata.promiseTitle
          })
        }
      } else {}
    }).catch((error) => {})
  },

  previewImage(e) {
    let that = this
    var current = e.target.dataset.src;
    var imgalist = []
    for (let i = 0; i < that.data.delAllData.product_deatilCarouselImg.length; i++) {
      imgalist.push(that.data.delAllData.product_deatilCarouselImg[i].originalImg)
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgalist // 需要预览的图片http链接列表
    })
  },
  // vip跳转
  vipSkip: function() {
    if (this.data.vipBl) {
      let that = this
      getApp().getUserData(that, true).then(res => {

      }).catch((error) => {
        getApp().tdsdk.event({
          id: '商品分享-VIP点击',
          label: '商品分享-VIP点击',
          params: {
            form: wx.getStorageSync('userId')
          }
        });
        yd.util.log("VIP分享")
        // that.initUserInfo()
        this.saveShareCard(this)
        this.showBox();
      })
    } else {
      wx.switchTab({
        url: "/pages/vip/vip"
      })
    }
  },
  // suk更换
  sukClick: function(e) {
    let sukId = e.currentTarget.dataset.suk;
    this.setData({
      byComid: e.currentTarget.dataset.suk
    })
    this.getAllData(sukId)
  },
  /**
   * 判断vip用户
   */
  isVip: function(that) {
    //wx.setStorageSync("levelType", 2)
    if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType") > 1) {
      that.setData({
        vipBl: true,
        levelType: wx.getStorageSync("levelType")
      })
    }
  },
  // 地址条转
  addSkip: function(e) {
    let that = this;
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        wx.navigateTo({
          url: '../manageadd/manageadd',

          complete: function(res) {
            wx.hideLoading();
          },
        })
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  // 返回首页
  hoemF: function() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 分享
  shareF: function() {
    let that = this
    getApp().jurisdiction(that, true).then(res => {

    }).catch((error) => {
      getApp().tdsdk.event({
        id: '商品分享-普通用户点击',
        label: '商品分享-普通用户点击',
        params: {
          form: wx.getStorageSync('userId')
        }
      });
      yd.util.log("VIP分享")
      // that.initUserInfo()
      this.saveShareCard(this)
      this.showBox();
    })
  },
  //vip分享
  shareBox: function() {
    let that = this
    getApp().getUserData(that, true).then(res => {

    }).catch((error) => {
      getApp().tdsdk.event({
        id: '商品分享-VIP点击',
        label: '商品分享-VIP点击',
        params: {
          form: wx.getStorageSync('userId')
        }
      });
      yd.util.log("VIP分享")
      // that.initUserInfo()
      this.saveShareCard(this)
      this.showBox();
    })
  },

  showBox: function() {
    if (this.data.isDrawSuccess) {
      getApp().showPop(this, 'shareBoxBl', 200);
    } else {
      this.setData({
        isAutoSave: true
      })
      yd.util.loading("加载中", true);
    }
  },
  //取消分享
  boxCancel: function() {
    getApp().cancelPop(this, 'shareBoxBl', 200)
  },
  //朋友圈
  sendCircle: function() {
    getApp().tdsdk.event({
      id: '商品分享-朋友圈',
      label: '商品分享-朋友圈',
      params: {
        form: wx.getStorageSync('userId')
      }
    });
    let userData = wx.getStorageSync('userinfo')
    yd.util.log(this.data.delAllData);
    console.log(`path=/pageageuser/pages/sharegoods/sharegoods?sukId=${this.data.delAllData.product_info.id}&qrcode=${userData.qrCodePath}&name=${userData.nickName}&img=${userData.avatarUrl}`)
    yd.userInformation = this.data.user //只有分享页面可用
    console.log(yd.userInformation.nickName)
    this.boxCancel();
    wx.navigateTo({
      url: `/pageageuser/pages/sharegoods/sharegoods?sukId=${this.data.delAllData.product_info.id}&qrcode=${this.data.qrCodePath}&name=${userData.nickName}&img=${userData.avatarUrl}`,
    });
  },
  /**
   * 微信授权
   */
  bindGetUserInfo: function(e) {
    let that = this;
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        that.atBuy()
        if (that.data.isTimeActivity &&(that.data.delAllData.activityGoods.type == 1 || that.data.delAllData.activityGoods.type == 5)
            && that.data.delAllData.activityGoods.statusFlag == 1) {
          that.getLimitNumber()
        }
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  spellBuy: function() {
    let that = this;
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        if (that.data.delAllData.activityGoods.subType == 303) {
          if (wx.getStorageSync('levelType')>1){
            that.atBuy()
            // that.data.openSpellBuy=true;
            that.setData({
              comNum: 1,
              openSpellBuy: true
            })
            if (that.data.isTimeActivity && that.data.delAllData.activityGoods.type == 3) {
              that.getSpellNumber()
            }
          }else{
            wx.showModal({
              title: '提示',
              content: '您还不是VIP，去看看其他拼团吧。',
              confirmText: '知道了',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/packagebuy/pages/spelllist/spelllist'
                  })
                }

              },
              fail: function (res) {
                yd.util.commonToast('您还不是VIP，去看看其他拼团吧。')
              }
            })
          }
        }else{
          that.atBuy()
          // that.data.openSpellBuy=true;
          that.setData({
            comNum: 1,
            openSpellBuy: true
          })
          if (that.data.isTimeActivity && that.data.delAllData.activityGoods.type == 3) {
            that.getSpellNumber()
          }
        }
      }).catch((error) => {
        console.log('error', error)
      })
    })
  },
  // 立即购买
  atBuy: function() {
    let that = this;
    getApp().showPop(that, 'shopboxBl', 304)
  },
  // 减少数量
  comNumJ: function() {
    let comNum = this.data.comNum;
    if (comNum > 1) {
      comNum--
    } else {
      yd.util.commonToast("商品数量不能小于1")
    }
    this.setData({
      comNum: comNum,
      saveNumber: yd.util.getPriceDouble(this.data.delAllData.product_info.selfEarningsPrice * comNum),
      totalNumber: yd.util.getPriceDouble(this.data.delAllData.product_info.sellPrice * comNum)
    })
  },
  // 增加数量
  comNumA: function() {
    let comNum = this.data.comNum;
    let comOkNum = this.data.comOkNum;
    // 暂时未定
    yd.util.log(comOkNum + "--" + (comNum))
    if (comNum < comOkNum) {
      yd.util.log(this.data.buyNumber)
      if (this.data.openSpellBuy) {
        if ((comNum + 1) > this.data.spellNumber) {
          yd.util.commonToast("您已到购买上限")
        } else {
          comNum++
        }
      } else {
        if (this.data.statusFlag == 1 && (comNum + 1) > this.data.buyNumber) {
          yd.util.commonToast("您已到购买上限")
        } else {
          comNum++
        }
      }
    } else {
      yd.util.commonToast("商品库存不足")
    }
    this.setData({
      comNum: comNum,
      saveNumber: yd.util.getPriceDouble(this.data.delAllData.product_info.selfEarningsPrice * comNum),
      totalNumber: yd.util.getPriceDouble(this.data.delAllData.product_info.sellPrice * comNum)
    })
  },
  // 关闭底部盒子
  closeShopBox: function() {
    getApp().cancelPop(this, 'shopboxBl', 304)
    if (this.data.openSpellBuy) {
      // this.data.openSpellBuy=false
      this.setData({
        openSpellBuy: false,
        comNum: 1,
        spellBackBl: false
      })
    }
  },
  // 空的方法
  kong: function() {},
  //生成订单
  createOrder: yd.util.notDoubleClick(function() {
    let that = this;
    let orderdata = {};
    orderdata.comNum = that.data.comNum;
    orderdata.comImg = that.data.delAllData.product_listImg.detailValue;
    orderdata.comName = that.data.delAllData.product_info.shortName;
    orderdata.comId = that.data.delAllData.product_info.id;
    orderdata.comSku = that.data.delAllData.product_info.specification;
    orderdata.comPrice = that.data.delAllData.product_info.sellPrice;
    orderdata.comAddress = that.data.delAllData.product_area;
    orderdata.selfEarningsPrice = that.data.saveNumber;
    orderdata.isProductareaSend = that.data.delAllData.product_info.isProductareaSend;
    if (that.data.openSpellBuy) {
      orderdata.activityId = that.data.delAllData.activityGoods.acticityId;
      orderdata.activityGoodsId = that.data.delAllData.activityGoods.id;
      orderdata.cpsUserId = yd.userCode ? yd.userCode : 0;
      orderdata.comPrice = that.data.delAllData.activityGoods.price;
    }
    getApp().tdsdk.event({
      id: '商品详情-生成订单',
      label: '商品详情-生成订单',
      params: {
        info: JSON.stringify(orderdata)
      }
    });
    wx.navigateTo({
      url: '../../pages/indent/indent?orderdata=' + JSON.stringify(orderdata),
      success: function() {
        that.closeShopBox()
      }
    })
  }),

  // 空状态回首页
  backHome: function() {
    console.log(123)
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isVip(this);
    wx.hideShareMenu();
    yd.userCode = (options.userCode) ? options.userCode : 0;
    yd.shareComid = (options.comid) ? options.comid : "";
    (options.comid) ? this.setData({
      byComid: options.comid,
      tag: options.tag ? options.tag : "默认"
    }): "";

    (options.msgId) ? this.setData({
      tag: "小程序push消息"
    }): "";
    if (options.label && options.msgId) {
      this.getFormId(options.label, options.msgId)
    }
    //解析二维码携带参数
    var scene = decodeURIComponent(options.scene);
    if (scene != null) {
      var parmer = scene.split("&");
      for (var i = 0; i < parmer.length; i++) {
        var info = parmer[i].split("=");
        switch (info[0]) {
          case "userId":
            yd.userCode = (info[1]) ? info[1] : 0;
            yd.util.log(yd.userCode)
            break;
          case "goodsId":
            (info[1]) ? yd.shareComid = info[1]: "";
            (info[1]) ? this.setData({
              byComid: info[1]
            }): "";
            yd.util.log(this.data.byComid)
            this.setData({
              tag: "朋友圈小程序码"
            });
            break
        }
      }
    }

    //后台cps调用
    if (yd.userCode != 0) {
      wx.setStorageSync("shareUser", yd.userCode)
      getApp().goodCPS()
    }

    let dalToken = wx.getStorageSync("token")
    if (dalToken) {
      this.setData({
        delToken: dalToken
      })
    }
    this.getAllData(this.data.byComid);

  },
  /**
   * 后台点击统计
   */
  getFormId(label, msgId) {
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/push/clickCount/${msgId}/${label}`, 'app'),
    })
  },
  getShareData: function() {
    let that = this;
    if (yd.shareTicket != null) {
      that.setData({
        tag: "会话分享卡片"
      })
      yd.util.log("分享自微信会话")
      yd.util.log(yd.shareTicket)
      wx.login({
        success: res => {
          yd.util.log(res)
          yd.util.log(res.code)
          let code = res.code
          wx.getShareInfo({
            shareTicket: yd.shareTicket,
            success(res) {
              yd.util.log(res)
              yd.ajax({
                method: 'POST',
                url: yd.api.getUrl(`/user/getGroupId/${code}/iyd6e211ae86d3`, 'app'),
                data: {
                  "errMsg": res.errMsg,
                  "encryptedData": res.encryptedData,
                  "iv": res.iv
                }
              }).then(res => {
                wx.setStorageSync("gid", res.data)
                yd.util.log("gid-" + res.data)
                if (res.code === 0) {
                  getApp().tdsdk.event({
                    id: '商品详情-群到访',
                    label: '商品详情-群到访',
                    params: {
                      group_id: res.data,
                      group_share_user: yd.userCode,
                      u_id: wx.getStorageSync('userId'),
                      g_id: that.data.byComid,
                      g_name: that.data.delAllData.product_info.name,
                      g_category: that.data.delAllData.product_info.categoryName,
                      g_price: that.data.delAllData.product_info.sellPrice,
                      g_earnings_percentage: that.data.delAllData.product_info.earningsPercentage
                    }
                  });
                }
              })
            },
            fail(res) {
              yd.util.log(res)
            }
          })
          yd.shareTicket = null;
        },
        fail(res) {
          yd.shareTicket = null;
        }
      })
    }

  },
  initGIOData: function() {
    let delAllData = this.data.delAllData;
    let doublePrice = delAllData.product_info.marketPrice - delAllData.product_info.sellPrice == 0 ? "无" : "有";
    this.getShareData();
    getApp().tdsdk.event({
      id: '访问详情页',
      label: '访问详情页',
      params: {
        g_id: this.data.byComid,
        g_name: delAllData.product_info.name,
        g_category: delAllData.product_info.categoryName,
        g_price: delAllData.product_info.sellPrice,
        g_double_price: doublePrice,
        g_earnings_percentage: delAllData.product_info.earningsPercentage,
        g_tag: this.data.tag
      }
    })
  },

  /**
   * 限时限购倒计时
   */
  limitTime(time) {
    //time=86400*2
    let that = this
    time = time + ''
    let time1 = time
    if (time1 < 0) {
      return
    }
    if (that.data.timeIndex) {
      clearInterval(that.data.timeIndex)
    }
    that.setData({
      show: true
    });
    let second = 0
    that.setData({
      timeIndex: setInterval(function() {
        time1 = time1 - 1
        if (time1 > 0) {
          let day = parseInt(time1 / 86400)
          that.setData({
            day: day
          });
          let hour = parseInt((time1 - day * 86400) / 3600)
          if (hour < 10) {
            hour = '0' + hour
          }
          that.setData({
            hour: hour
          });
          let minute = parseInt((time1 - day * 86400 - hour * 3600) / 60)
          if (minute < 10) {
            minute = '0' + minute
          }
          second = time1 - day * 86400 - hour * 3600 - minute * 60
          that.setData({
            minute: minute
          });
          if (second < 10) {
            second = '0' + second
          }
          that.setData({
            second: second
          });
          //yd.util.log(day+"--"+hour+"--"+minute+"--"+second)
        } else {
          that.getAllData(that.data.byComid)
          clearInterval(that.data.timeIndex)
        }
        that.setData({
          time: time1
        })
      }, 1000)
    });

  },
  getSpellNumber: function() {
    let that = this
    let data = this.data.delAllData
    wx.showLoading({
      title: '加载中...',
    })
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/group/startBuyCheck`, 'app'),
      data: {
        activityId: data.activityGoods.acticityId,
        buyNum: 1,
        productId: that.data.byComid,
        siteId: yd.locaData.siteId,
        'type': 0,
        groupId: 0
        // siteId: that.data.addressCode
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      yd.util.log(res)
      wx.hideLoading();
      if (res.code === 0) {
        // let spellNumber =
        that.setData({
          spellNumber: res.data.buyNum + res.data.remianNum,
          moverBuyNum: res.data.remianNum,
          spellBackBl: true
        })
      } else {
        that.setData({
          spellNumber: 0,
          comNum: 0
        })
        switch (res.code) {
          case 29001:
            yd.util.commonToast('活动不存在')
            break
          case 29002:
            yd.util.commonToast('活动商品不存在')
            break
          case 29999:
            yd.util.commonToast('操作失败')
            break
          case 29010:
            yd.util.commonToast('已达商品购买数量上限')
            break
          case 29012:
            yd.util.commonToast('已达最大开团数量限制')
            break
          case 29007:
            wx.showModal({
              title: '提示',
              content: '您本商品开团数量已达上限，去看看其他拼团商品吧',
              confirmText: '知道了',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pageageuser/pages/myspelllist/myspelllist'
                  })
                }
              },
              fail: function(res) {
                yd.util.commonToast('您本商品开团数量已达上限，去看看其他拼团商品吧')
              }
            })
            break
          case 29021:
            yd.util.commonToast('该团已满员')
            break
          case 29020:
            wx.showModal({
              title: '提示',
              content: '只有新用户才能参团，去开团吧！',
              confirmText: '去开团',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/packagebuy/pages/spelllist/spelllist'
                  })
                }
              },
              fail: function(res) {
                yd.util.commonToast('只有新用户才能参团，去开团吧！')
              }
            })
            break
          case 29022:
            yd.util.commonToast('您已加入该团')
            break
          case 29011:
            wx.showModal({
              title: '提示',
              content: '您还不是VIP,去看看其他拼团吧',
              confirmText: '知道了',
              showCancel: false,
              success: function(res) {
                if (res.confirm){
                  wx.reLaunch({
                    url: '/packagebuy/pages/spelllist/spelllist'
                  })
                }
              },
              fail: function(res) {
                yd.util.commonToast('您还不是VIP,去看看其他拼团吧')
              }
            })
            break;
          default:
            yd.util.commonToast(res.msg)
        }
      }
    }).catch((error) => {
      wx.hideLoading();
      console.log('error', error)
      pageState.error()
    })
  },
  getLimitNumber: function() {
    let that = this
    let data = this.data.delAllData
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/findActivityBuyNum/${data.activityGoods.acticityId}/${that.data.byComid}/${that.data.addressCode}`, 'app')
    }).then(res => {
      wx.stopPullDownRefresh();
      yd.util.log(res)
      if (res.code == 30000 || res.code == 33025) {
        that.setData({
          buyNumber: res.data
        })
        if (res.data == 0) {
          that.setData({
            comNum: 0
          })
        }
        yd.util.log("疯狂星期五" + res.data.list)
      } else {
        yd.util.log("执行")
        that.setData({
          buyNumber: -1,
          comNum: 0
        })
        yd.util.commonToast(res.msg)
      }
    }).catch((error) => {
      console.log('error', error)
      pageState.error()
    })
  },
  checkActivityBuy: function() {
    let that = this
    let data = this.data.delAllData
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/checkActivityTrade/${data.activityGoods.acticityId}/${that.data.byComid}/${that.data.addressCode}/${that.data.comNum}`, 'app')
    }).then(res => {
      wx.stopPullDownRefresh();
      yd.util.log(res)
      if (res.code == 30000) {
        yd.util.log("疯狂星期五可购买")
      }
    }).catch((error) => {
      console.log('error', error)
      pageState.error()
    })
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
    this.isVip(this);

    // let addressArr = (that.data.delAllData.product_area)? that.data.delAllData.product_area : '';
    let defaultAddress = wx.getStorageSync("defaultAddress");
    // let =
    if (that.data.delAllData.product_area && yd.address) {
      let param = {
        param: {
          areaCode: "",
          productData: [{
            goodsId: that.data.delAllData.product_info.id
          }]
        }
      }
      let address = yd.address;
      let addresstext = address.city + "  " + address.area + " " + address.street;
      that.setData({
        addresstext: addresstext,
        addressData: yd.address,
        addressCode: yd.address.cityCode
      });
      param.param.areaCode = yd.address.cityCode;
      param.param.countyAreaCode = yd.address.nationalCode;
      that.judge(param);
    } else if (that.data.delAllData.product_area && defaultAddress) {
      let param = {
        param: {
          areaCode: "",
          productData: [{
            goodsId: that.data.delAllData.product_info.id
          }]
        }
      }
      let addresstext = defaultAddress.city + "  " + defaultAddress.area + " " + defaultAddress.street;
      that.setData({
        addresstext: addresstext,
        defaultAddress: defaultAddress,
        addressCode: defaultAddress.cityCode
      });
      param.param.areaCode = defaultAddress.cityCode
      param.param.countyAreaCode = defaultAddress.nationalCode
      that.judge(param)
    } else if (that.data.delAllData.product_area && yd.locaData) {
      let param = {
        param: {
          areaCode: "",
          productData: [{
            goodsId: that.data.delAllData.product_info.id
          }]
        }
      }
      let addresstext = yd.locaData.areaName;
      that.setData({
        addresstext: addresstext,
        addLocaText: yd.locaData,
        addressCode: yd.locaData.areaCode
      });
      param.param.areaCode = yd.locaData.areaCode
      that.judge(param)
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
  onUnload: function() {
    clearInterval(this.data.timeIndex)
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
  nullEvent: function() {

  },
  onRetry: function() {
    this.getAllData(this.data.byComid);
  },
  goInfo: function() {
    wx.navigateTo({
      url: '/packagepower/pages/retryinfo/retryinfo',
    })
  },
  getGoodImg: function(delAllData) {
    let pageState = pagestates(this)
    let that = this;
    wx.downloadFile({
      url: delAllData.product_listImg.detailValue,
      success: function(res) {
        console.log(res.tempFilePath)
        that.draw(delAllData, res.tempFilePath)
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },
  draw: function(delAllData, bgpath) {
    const ctx = wx.createCanvasContext('shareCanvasMini');
    if (ctx.measureText) {
      yd.util.log("绘制")
      //绘制背景
      easyCanvas.drawRect(ctx,"#FAFAFA",0, 0, 840, 680);

      //绘制商品
      ctx.save();
      easyCanvas.drawRoundRect(ctx,"#FFF",0,0,840,440,0);
      easyCanvas.drawImage(ctx,bgpath,0,-160,840,672);
      ctx.restore();
      //绘制介绍文案
      // ctx.save()
      if (this.data.isTimeActivity && delAllData.activityGoods.type == 1) {
        easyCanvas.drawImage(ctx,'/img/t_bg_message.png', 0, 436, 840, 96);
        easyCanvas.drawImage(ctx,'/img/t_icon_detail.png', 32, 460, 186, 60);
        if (this.data.statusFlag != 3) {
            let w1 = easyCanvas.drawText(ctx,'/',40,'#F8E71C',250,500,true);
            easyCanvas.drawText(ctx,this.data.btime,40,'#FFFFFF',280+w1,500,true);
        }
      } else if (delAllData.activityGoods != null && delAllData.activityGoods.type == 3) {
        //绘制拼团
        easyCanvas.drawImage(ctx,'/img/spell_share_bar.png',0,436,840,96);
        let w1 = easyCanvas.drawText(ctx,delAllData.activityGoods.peopleNum,50,'#FFE443',140,504,true);
        easyCanvas.drawText(ctx,"人团",36,'#FFFFFF',144+w1,504,true);
      } else {
        let name = delAllData.product_info.shortName;
        if (name.length > 16) {
          name = name.substr(0, 15) + "..."
        }
        easyCanvas.drawText(ctx,name,48,'#9B9B9B',32,528,true);
      }
      // ctx.restore();
      //绘制抢购人数
      if (delAllData.product_info.showSellBaseCount >= 100 && this.data.statusFlag != 3) {
        let numw=easyCanvas.measureText(ctx,delAllData.product_info.showSellBaseCount + '人已购买',40);
        if (this.data.isTimeActivity && (delAllData.activityGoods.type == 1 || delAllData.activityGoods.type == 3)) {
          easyCanvas.drawText(ctx,delAllData.product_info.showSellBaseCount + '人已购买',40,'#FFF',812-numw,500);
        } else {
          easyCanvas.drawText(ctx,delAllData.product_info.showSellBaseCount + '人已购买',40,'#FFF',812-numw,412);
        }
      } else {
        if (this.data.isTimeActivity && delAllData.activityGoods.type == 1 && this.data.statusFlag == 3) {
          let date = this.data.startTime + " 开始";
          let datew=easyCanvas.measureText(ctx,date,40);
          easyCanvas.drawText(ctx,date,40,'#FFFFFF',812-datew,500,true);
        }
      }
      //绘制价格
      easyCanvas.drawText(ctx,"¥",56,'#FF5A5A',32,640,true);
      let priceWidth = 0;
      if (this.data.isTimeActivity && (delAllData.activityGoods.type == 1 || delAllData.activityGoods.type == 3)) {
        priceWidth = easyCanvas.drawText(ctx,delAllData.product_info.discountPrice,80,'#FF5A5A',68,645,true);
      } else {
        priceWidth = easyCanvas.drawText(ctx,delAllData.product_info.sellPrice,80,'#FF5A5A',68,645,true);
      }

      if ((delAllData.activityGoods != null && delAllData.product_info.marketPrice != 0) || (delAllData.product_info.marketPrice != delAllData.product_info.sellPrice
          && delAllData.product_info.marketPrice != 0 && delAllData.product_info.marketPrice != null
          && delAllData.product_info.marketPrice != '' && delAllData.product_info.marketPrice != '0.00')) {
            let priceMMidth = easyCanvas.drawText(ctx,"¥" + delAllData.product_info.marketPrice,48,'#808080',priceWidth+88,640,true);
            easyCanvas.drawLine(ctx,priceWidth+88,624,priceWidth+88+priceMMidth,624,2,"#808080");
      }
      ctx.save()
      const grd = easyCanvas.createLinearGradient(ctx,560,560,248,96,'#FF6539','#FF3333');
      easyCanvas.drawRoundRect(ctx,"#FFF",560,560,248,96,18);
      easyCanvas.drawRect(ctx,grd,560,560,808,656);
      ctx.restore();
      let btnText = (delAllData.activityGoods != null && delAllData.activityGoods.type == 3) ? "去开团" : "去抢购";
      easyCanvas.drawText(ctx,btnText,56,'#FFF',(560+(248-easyCanvas.measureText(ctx,btnText,56))/2),630,true);
      let that = this;
      ctx.draw(false,
        function(res) {
          yd.util.log("绘制结束回调")
          that.setData({
            isDrawSuccess: true
          })
          that.saveShareCard(that);
          wx.showShareMenu({
            withShareTicket: true
          });
          if (that.data.isAutoSave) {
            that.setData({
              isAutoSave: false
            });
            wx.hideLoading();
            that.showBox();
          } else {
            wx.hideLoading();
          }
        }
      );

    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
      wx.hideLoading();
      wx.showShareMenu({
        withShareTicket: true
      });
    }
  },

  /**
   * 保存分享图片到相册
   */
  saveShareCard: function(that, isTry = true) {
    if (this.data.isDrawSuccess) {
      easyCanvas.save2Memory(that,"shareCanvasMini").then(res=>{
          yd.util.log("图片保存成功");
          that.setData({
              sharePath: res
          })
      }).catch(res=>{
          if (isTry) {
              //绘制失败重试机制
              that.saveShareCard(that, false);
          }
          yd.util.log("分享：保存失败")
      })
    }
  },

  /**
   * 订阅消息
   */
  bookMessage: function() {
    let that = this;
    getApp().jurisdiction(this, true).then(res => {

    }).catch(res => {
      yd.util.log("已经有授权");
      if (that.data.delAllData.activityGoods.isSub) {
        yd.util.commonToast('已设置提醒')
      } else {
        that.bookGoods(that.data.delAllData.activityGoods.acticityId, that.data.delAllData.product_info.id);
      }
    })
  },

  /**
   * 订阅商品
   * */
  bookGoods: function(activityId, goodsId) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/subscribe/${activityId}/${goodsId}`, 'app'),
    }).then(res => {
      if (res.code === 0) {
        yd.util.log("订阅成功")
        yd.util.commonToast("将在开场前5分钟提示您！");
        that.getAllData(this.data.byComid, false);
      } else {
        res.msg ? yd.util.commonToast(res.msg) : '';
      }
    })
  },

  goLimit: function(e) {
    let that = this;
    console.log(e)

    if (e.detail.acttype == 3) {
      if (getCurrentPages().length > 1 && yd.util.getPagesRoute('prev') == "/packagebuy/pages/spelllist/spelllist") {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.redirectTo({
          url: `/packagebuy/pages/spelllist/spelllist`,
        })
      }
    } else {
      if (getCurrentPages().length > 1 && yd.util.getPagesRoute('prev') == "/packagepower/pages/limittime/limittime") {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.redirectTo({
          url: `/packagepower/pages/limittime/limittime?activityId=${that.data.delAllData.activityGoods.acticityId}`,
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    this.boxCancel();
    let that = this;
    let userId = wx.getStorageSync('userId');
    let shareimg = that.data.sharePath ? that.data.sharePath : ""
    if (shareimg == "") {
      that.saveShareCard(that)
    }
    getApp().tdsdk.event({
      id: '商品分享-群会话',
      label: '商品分享-群会话',
      params: {
        from: wx.getStorageSync('userId'),
        canvas_state: shareimg == "" ? "失败" : "成功"
      }
    });
    yd.util.log("share_img" + that.data.sharePath)
    yd.util.log(`packagebuy/pages/details/details?comid=${that.data.delAllData.product_info.id}&userCode=${userId}`)

    getApp().tdsdk.share({
      title: `${this.data.delAllData.product_info.name}`,
      path: `packagebuy/pages/details/details?comid=${that.data.delAllData.product_info.id}&userCode=${userId}`
    });
    return {
      title: `${this.data.delAllData.product_info.name}`,
      imageUrl: shareimg,
      path: `packagebuy/pages/details/details?comid=${that.data.delAllData.product_info.id}&userCode=${userId}`
    }
  }
})({
  onPageScroll: true
}))
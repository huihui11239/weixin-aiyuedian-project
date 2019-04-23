// pages/mine/mine.js
const yd = getApp().globalData;
Page({
  data: {
    // levelType: wx.getStorageSync('levelType'),
    // levelType: 2,
    //用户个人信息
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
    vipQAlist: [],
    hiddenBl: true,
    animationData: {},
    userBl: false,
    vipShareText: [{
        text: "定期美食试吃券"
      },
      {
        text: "队员专属优惠券"
      },
      {
        text: "每日推荐金品好货"
      },
      {
        text: "官方线下分享会"
      }
    ],
    swiperData: [
      [{
          name: "法国经典葡萄酒礼包",
          money: "481.00",
          url: "https://img.iyuedian.com/mini/govip/gifboximg1.jpg"
        },
        {
          name: "希腊特级橄榄油礼包",
          money: "428.80",
          url: "https://img.iyuedian.com/mini/govip/gifboximg2.jpg"
        },
        {
          name: "海外宝贝护理礼包",
          money: "496.00",
          url: "https://img.iyuedian.com/mini/govip/gifboximg3.jpg"
        },
        {
          name: "学生健康成长礼包",
          money: "402.00",
          url: "https://img.iyuedian.com/mini/govip/gifboximg4.jpg"
        }
      ],
      [{
          name: "时光重现欢颜礼包",
          money: "472.00",
          url: "https://img.iyuedian.com/mini/govip/gifboximg6.jpg"
        },
        {
          name: "不老城希腊养生礼包",
          money: "447.60",
          url: "https://img.iyuedian.com/mini/govip/gifboximg5.jpg"
        },
        {
          name: "妈咪极致保养礼包",
          money: "447.60",
          url: "https://img.iyuedian.com/mini/govip/gifboximg7.jpg"
        },
        {
          name: "懒人最爱超净礼包",
          money: "472.00",
          url: "https://img.iyuedian.com/mini/govip/gifboximg12.jpg"
        }
      ],
      [{
          name: "经典红茶+绿茶礼包",
          money: "486.00",
          url: "https://img.iyuedian.com/mini/govip/gifboximg9.jpg"
        },
        {
          name: "自然果实天然大礼包",
          money: "485.60",
          url: "https://img.iyuedian.com/mini/govip/gifboximg10.jpg"
        },
        {
          name: "单身贵族静享生活礼包",
          money: "444.30",
          url: "https://img.iyuedian.com/mini/govip/gifboximg13.jpg"
        }
      ]
    ],
    gifBoxData: [{
        url: "https://img.iyuedian.com/mini/vipgit/vipfixed1.png",
        name1: "洪湖大号麻辣小龙虾600g * 2",
        name2: "单身贵族深夜热辣伴侣",
        sellnum: "17863",
        money1: "158.00",
        money2: "208.00",
        sharemoney: "15.80"
      },
      {
        url: "https://img.iyuedian.com/mini/vipgit/vipfixed2.png",
        name1: "澳洲西冷牛排双份装",
        name2: "蓝天、碧水中的鲜嫩牛排",
        sellnum: "8845",
        money1: "79.60",
        money2: "119.00",
        sharemoney: "7.96"
      },
      {
        url: "https://img.iyuedian.com/mini/vipgit/vipfixed3.png",
        name1: "带阳光气息玫瑰葡萄1串装",
        name2: "无籽甜葡萄宝宝最爱",
        sellnum: "5931",
        money1: "108.00",
        money2: "188.00",
        sharemoney: "10.80"
      },
      {
        url: "https://img.iyuedian.com/mini/vipgit/vipfixed4.png",
        name1: "南极无刺银鳕鱼块双份套装",
        name2: "幼儿辅食 纯正野生无添加",
        sellnum: "8549",
        money1: "119.8",
        money2: "186",
        sharemoney: "11.98"
      }

    ],
    show: true,
    vipBl: false,
    shareData: null,
    vipData: null,
    userData: null,
    shareTag: 0, //1:邀请VIP 2.邀请团队伙伴
    books: [{
        qData: "什么是悦店？",
        aData: "悦店是中国安心健康电商领导品牌春播所孵化的新平台，依托春播严格的供应链、物流仓配系统，搭建一个由千万妈妈组成的社交零售网络，遵循“安心、好吃、不贵”的核心原则，严格甄选每一件选品，将全球优质商品带入每一个中国家庭。"
      },
      {
        qData: "悦店的商品品质为什么值得信赖？",
        aData: "悦店所有的商品都严格依照春播品控标准选取，生鲜商品都要通过春播BEST检测，春播品控检测两大检测标准，除此之外，春播还展示了商品本身带有的各种安心度认证，针对每个品类制定对应的检测标准。依旧是春播选品，质量标准等同春播，品质依旧让人安心。"
      },
      {
        qData: "什么是悦店VIP？",
        aData: "在悦店VIP页面支付399元开通悦店VIP，可获得2年悦店VIP资格，现在购买还能免费获得超值大礼包。你将获得自买省钱，最高可获得30%额外奖励的会员权益。"
      },
      {
        qData: "悦店VIP如何获得VIP权益？",
        aData: "成为悦店VIP，当你在悦店购物时，将可以获得VIP的自购返现奖励。如果你邀请他人加入你的团队，成为你的悦粉，大家还可以一起获得悦店的诸多福利，轻松享受悦店的优质服务，同时你也可以获得公司一定额度的团队奖励津贴。"
      },
      {
        qData: "如何生成您的悦店团队专属邀请二维码？",
        aData: "成功开通悦店VIP后，点击悦店页面底部VIP按钮，进入VIP页面，点击“立即邀请”，即可获取专属二维码。"
      },
      {
        qData: "悦店VIP为什么需要打造自己的团队？",
        aData: "当用户加入你的团队，悦店会根据团队规模为VIP为你的团队提供的新人券，群福利券，商品试吃券，活动礼品券等各种福利，大家一起获得更多福利。VIP打造自己的团队，悦店也会提供给VIP用户管理津贴更好的服务自己的团队成员。"
      },
      {
        qData: "如何获取你的专属客服？",
        aData: "成为悦店VIP，进入悦店后点击页面右下角按钮进入“我的”页面，点击页面上的“客服”按钮即可获取你的专属客服。"
      },
      {
        qData: "如何快速获取悦店服务？",
        aData: "搜索“悦店优选”，点击进入小程序，苹果手机用户点击右上角的三个圆点，点击添加到我的小程序，下次即可在微信首页下拉找到小程序啦。"
      }
    ]
  },
  // 分享
  openShare:function(){
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  /**
   * 判断vip用户
   */
  isVip: function() {
    let that = this;
    if (wx.getStorageSync("levelType") != null && wx.getStorageSync("levelType") > 1) {
      console.log(wx.getStorageSync("levelType"));
      that.setData({
        vipBl: true,
        levelType: wx.getStorageSync("levelType")
      });
      console.log(this.data.levelType)
      wx.getStorageSync('userinfo') ? wx.showShareMenu({withShareTicket: true}): ""
    }
    if (wx.getStorageSync("levelType") > 1) {
      wx.setNavigationBarTitle({
        title: 'VIP'
      })
      yd.ajax({
        method: 'GET',
        url: yd.api.getUrl(`/manage/data/queryByCodeType/vip_qa`, 'app')
      }).then(res => {
        if(res.code==0){
          that.setData({
            vipQAlist: res.data
          });
        }
      })
    }else{
      wx.setNavigationBarTitle({
        title: '开通VIP'
      })
      that.setData({ vipBl: false });
    }
  },
  /**
   * 同意协议
   */
  govipsuego() {
    let that = this;
    that.setData({
      show: !that.data.show
    })
  },

  /**
   * 购买vip
   */
  govippay: function() {
    let that = this;
    if (this.data.show == false) {
      yd.util.commonToast('请阅读并同意购买须知')
      return
    }
    getApp().jurisdiction(that).then(res => {

    }).catch((error) => {
      getApp().checkPhone(that).then(res => {
        that.queryVip();
      }).catch((error) => {
        console.log('error', error)
      })
    })

  },

  /**
   * 查看协议
   */
  agreement: yd.util.notDoubleClick(function(e) {
    wx.navigateTo({
      url: '../../pageageuser/pages/agreement/agreement',
    })
  }),
  // 查询是否有vip订单
  queryVip: yd.util.notDoubleClick(function() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/trade/checkVipTrade`, 'app')
      // 暂时使用假数据 
    }).then(res => {
      console.log(res);
      if (res.data === 0) {
        console.log(res);
        wx.navigateTo({
          url: '../../packagepower/pages/vippurchase/vippurchase',
          success: function() {
            wx.hideLoading()
          }
        })
      } else if (res.data == "-1") {
        // console.log(res)
        wx.hideLoading()
        yd.util.clearLocalData('token')
        getApp().login().then(res => {
          if (wx.getStorageSync("levelType") > 1) {
            wx.showModal({
              title: '提示',
              content: '恭喜您，已经获得了悦店VIP身份！',
              showCancel: false,
              confirmText: '知道了',
              success: function(res) {
                if (res.confirm) {
                  that.isVip()
                }
              }
            })
          } else {
            if (res.msg) {
                yd.util.commonToast(res.msg)
            }
          }
        })
      } else if (res.data) {
        wx.hideLoading();
        wx.navigateTo({
          url: `../../pageageuser/pages/orderdetails/orderdetails?id=${res.data}&pay=1&tag=VIP页`,
          success: function() {
            wx.hideLoading()
          }
        })
      };
      // wx.navigateTo({
      //   url: '../../packagepower/pages/vippurchase/vippurchase',
      //   success: function () {
      //     wx.hideLoading()
      //   }
      // })
    }).catch((error) => {
      wx.hideLoading();
      console.log('error', error)
    })
  }),
  // 获取vip首页信息
  getVip:function() {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/profit/vip/index`, 'app')
      // 暂时使用假数据 
    }).then(res => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
      console.log(res);
      if(res.code==0){
        if (res.data.userLevel == 1) {
          if (wx.getStorageSync('levelType') > 1) {
            getApp().login().then(res => {
              wx.setStorageSync('levelType', 1)
              that.isVip()
            }).catch(res => {
              wx.setStorageSync('levelType', 1)
              that.isVip()
              res.msg ? yd.util.commonToast(res.msg) : ''
            })
          }
        } else {
          res.data.todayExpectedProfitAmount = yd.util.getPriceDouble(res.data.todayExpectedProfitAmount);
          res.data.totalProfitAmount = yd.util.getPriceDouble(res.data.totalProfitAmount);
          res.data.totalProfitAmountMore = yd.util.getPriceDouble(res.data.totalProfitAmount / 2);
          res.data.yesterdayProfitAmount = yd.util.getPriceDouble(res.data.yesterdayProfitAmount);
          res.data.expectedProfitAmount = yd.util.getPriceDouble(res.data.expectedProfitAmount);
          res.data.availableAmount = yd.util.getPriceDouble(res.data.availableAmount);
          res.data.teamTotalProfitAmount = yd.util.getPriceDouble(res.data.teamTotalProfitAmount);
          if (res.data.userLevel == wx.getStorageSync('levelType') || res.data.userLevel == undefined) { } else {
            wx.setStorageSync('levelType', res.data.userLevel)
            that.isVip();
          }
          that.setData({
            vipData: res.data
          });
        }
      }
    }).catch((error) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    })
  },
  onLoad: function(option) {
    wx.hideShareMenu({})
    let that = this;
    // 2018-9-4 jinjinjin 获取点击数量
    if (option.label && option.msgId) {
      getApp().statisticsClick(option.label, option.msgId)
    }
    // that.getVip();
  },
  // vip收益
  earningsSkip: yd.util.notDoubleClick(function(e) {
    if (e.currentTarget.dataset.status == 2) {
      wx.navigateTo({
        url: '../../packagepower/pages/earnings/earnings?type2=3&type3=yesterday'
      })
    } else if (e.currentTarget.dataset.status == 3) {
      wx.navigateTo({
        url: '../../packagepower/pages/earnings/earnings?type2=1'
      })
    } else if (e.currentTarget.dataset.status == 4) {
      wx.navigateTo({
        url: '../../packagepower/pages/earnings/earnings?type3=today'
      })
    } else {
      wx.navigateTo({
        url: '../../packagepower/pages/earnings/earnings?'
      })
    }
  }),
  // vip余额跳转
  balanceSkip: yd.util.notDoubleClick(function(e) {
    wx.navigateTo({
      url: '../../packagepower/pages/vipbalance/vipbalance',
    })
  }),
  //团队成员
  goPartner: yd.util.notDoubleClick(function() {
    wx.navigateTo({
      url: '../../packagepower/pages/partner/partner',
    })
    // 临时demo使用
    // wx.navigateTo({
    //   url: '../../packagepower/pages/memberdel/memberdel',
    // })
  }),
   //去潜在成员
  goLatent: yd.util.notDoubleClick(function() {
    wx.navigateTo({
      url: '/packagepower/pages/latent/latent',
    })
  }),
  // 去团队流水
  goTeam: yd.util.notDoubleClick(function() {
    wx.navigateTo({
      url: '../../packagepower/pages/teamdetails/teamdetails',
    })
  }),
  //开通vip

  /**
   * 邀请伙伴
   */
  invitationPartner: yd.util.notDoubleClick(function() {
    wx.navigateTo({
      url: '../../pageageuser/pages/partner/partner',
    })
  }),
  // getUserSetting: function() {
  //   let that = this;
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         that.getUserData();
  //         that.setData({
  //           userBl: true
  //         })
  //       } else {
  //         that.setData({
  //           userBl: false
  //         })
  //       }
  //     }
  //   })
  // },
  pullNewNl() {
    let that = this;
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/manage/data/queryByCodeType/month_pull_new`, 'app')
    }).then(res => {
      if (res.code == 0) {
        if (res.data[0].value == 1) {
          //黑色星期五开关[0；关闭 1：开启]
          that.data.pullNewNl = true
        } else {

        }
      }

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    this.isVip();
    that.getVip();
    that.pullNewNl();
    if  (this.data.vipBl) {
     
      if (that.data.shareData == null) {
        that.getInvitationData()
      }
      if (that.data.vipCardData == null) {
        that.getVipData()
      }
      that.initShareImage();
    }
    if (yd.oneVip === 2) {
      yd.util.commonToast("恭喜您开通VIP");
      yd.oneVip = 1;
    }
  },
  initShareImage: function() {
    let index = Math.ceil(Math.random() * 10);
    if (index == 0) {
      index = 1;
    }
    this.setData({
      shareImage: "https://img.iyuedian.com/mini/share/p" + index + ".png"
    })
  },
  // 邀请新伙伴
  invitationPartner1: yd.util.notDoubleClick(function() {
    let that = this;
    getApp().getUserData(that).then(res => {

    }).catch((error) => {
      if (that.data.shareData == null) {
        that.getInvitationData(true);
      }
      if (that.data.shareData != null) {
        that.setData({
          shareTag: 2
        });
        that.showPop();
      }
        getApp().tdsdk.event({
            id: 'VIP分享点击',
            label: 'VIP分享点击',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    })

  }),
  // 邀请VIP
  invitationVIP1: yd.util.notDoubleClick(function() {
    console.log(this.data.pullNewNl)
    let that = this;
    if (that.data.pullNewNl) {
      that.pullNew();
    } else {
      getApp().getUserData(that).then(res => {

      }).catch((error) => {
        if (that.data.vipCardData == null) {
          that.getVipData(true);
        }
        if (that.data.vipCardData != null) {
          that.setData({
            shareTag: 1
          });
          that.showPop();
        }
          getApp().tdsdk.event({
              id: 'VIP分享点击',
              label: 'VIP分享点击',
              params: {
                  from: wx.getStorageSync('userId')
              }
          });
      })

    }

  }),
  getInvitationData: function(isTry = false) {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/vipInviteCode`, 'app')
    }).then(res => {
      wx.hideLoading();
      yd.util.log("显示分享卡片");
      console.log(res)
      if (res.code === 0) {
        wx.setStorageSync("inviteCode", res.data.inviteCode)
        that.setData({
          shareData: res.data,
        });
        if (isTry) {
          that.showPop();
        }
      } else {
          if (res.msg) {
              yd.util.commonToast(res.msg)
          }
      }

    }).catch((error) => {})
  },

  getVipData: function(isTry = false) {
    let userCode = wx.getStorageSync('userId')
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/getCpsVipShare/${userCode}`, 'app')
    }).then(res => {
      if (res.code === 0) {
        yd.util.log(res.data)
        that.setData({
          vipCardData: res.data,
        });
        if (isTry) {
          that.showPop();
        }
      } else {
          if (res.msg) {
              yd.util.commonToast(res.msg)
          }
      }

    }).catch((error) => {})
  },
  shareCancel() {
    this.cancelPop();
  },
  sendCircle() {
    let that = this;
    that.cancelPop();
    let userData= wx.getStorageSync('userinfo')
    if (that.data.shareTag == 1) {
      wx.navigateTo({
        url: '../../packagepower/pages/sharevip/sharevip?userName=' + userData.nickName + "&userIcon=" +
         userData.avatarUrl + "&qrCode=" + that.data.vipCardData.wxImg
      });
        getApp().tdsdk.event({
            id: 'VIP分享-朋友圈',
            label: 'VIP分享-朋友圈',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    } else if ((that.data.shareTag == 2)) {
      wx.navigateTo({
        url: '../../packagepower/pages/sharecardv2/sharecardv2?userName=' + userData.nickName + "&userIcon=" +
          userData.avatarUrl + "&qrCode=" + that.data.shareData.inviteImgUrl + "&planJoinCount=" +
          that.data.shareData.planJoinCount + "&teamUserCount=" + that.data.shareData.teamUserCount + "&shareImage=" +
          that.data.shareImage
      })
    }

  },
  nullEvent: function() {

  },
  //晋级规则
  upRule: function() {

    wx.navigateTo({
      url: '../../packagepower/pages/newwebview/newwebview?webview=https://wx.iyuedian.com/wxgoldvip/viprule/index.html' +
        '&token=' + wx.getStorageSync('token')
    })
  },
  //月活拉新
  pullNew: function() {
    wx.navigateTo({
      url: '../../packagepower/pages/pullnew/pullnew'
    })
  },
  showPop: function() {
    getApp().showPop(this, "hiddenBl", 200);
  },
  cancelPop: function() {
    getApp().cancelPop(this, "hiddenBl", 200);
  },
  webback: function(e) {
    console.log(e)
  },
  // 分享生命周期
  onShareAppMessage: function(res) {
      getApp().tdsdk.event({
          id: 'VIP分享-群会话',
          label: 'VIP分享-群会话',
          params: {
              from: wx.getStorageSync('userId')
          }
      });
    yd.util.log("inviteCode" + wx.getStorageSync("inviteCode"));
    yd.util.log(wx.getStorageSync("inviteCode"));
    let userData = wx.getStorageSync('userinfo')
    let that = this;
    that.cancelPop();
    if (this.data.shareTag == 1) {
      yd.util.log(userData.nickName + "---name")
        getApp().tdsdk.share({
            title: userData.nickName + `邀请你开通悦店VIP`,
            path: '/pageageuser/pages/joinvip/joinvip?inviteCode=' + that.data.vipCardData.inviteCode + "&userId=" + wx.getStorageSync('userId')
        });
      return {
        title: userData.nickName + `邀请你开通悦店VIP`,
        imageUrl: 'https://img.iyuedian.com/mini/share/chat_vip.png',
        path: '/pageageuser/pages/joinvip/joinvip?inviteCode=' + that.data.vipCardData.inviteCode + "&userId=" + wx.getStorageSync('userId')
      }
    } else {
        getApp().tdsdk.share({
            title: userData.nickName + `邀你加入悦店`,
            path: '/pageageuser/pages/jointeam/jointeam?inviteCode=' + wx.getStorageSync("inviteCode")
        });
        return {
        title: userData.nickName + `邀你加入悦店`,
        imageUrl: 'https://img.iyuedian.com/mini/share/chat_join.png',
        path: '/pageageuser/pages/jointeam/jointeam?inviteCode=' + wx.getStorageSync("inviteCode")
      }
    }
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();//在标题栏中显示加载
    if (this.data.vipBl) {
      this.getVip()
    } else {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    }
  },
})
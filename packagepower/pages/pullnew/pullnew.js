// packagepower/pages/pullnew/pullnew.js
const yd = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barnum: 1,
    hasNextPage: true,
    awardList: '',
    hiddenBl: true,
    isIphoneX: wx.getStorageSync('isIphoneX'),
    backfillBL: false,
    getAwardListBL: false,
    animationData:{},
  },
  //打开分享
  openShare: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //获取规则列表
  getRuleNum: function() {
    let that = this;
    yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/vipUser/invitation/ruleList`, 'app')
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          ruleNum: res.data
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
      res.msg ? yd.util.commonToast(res.msg) : ''
    })
  },
  //获得历史奖励
  getAwardList: function() {
    let that = this;
    if (that.data.hasNextPage) {
      let awardListNum = (that.data.awardList) ? (that.data.awardList.length + 1) : 1;
      let awardListIndex = awardListNum - 1;
      let awardList = (that.data.awardList) ? that.data.awardList : new Array();
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/vipUser/invitation/list`, 'app'),
        data: {
          pageNum: awardListNum
        }
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            let createDateStr = res.data.list[i].createDateStr;
            let num3 = createDateStr.substr(5, 6);
            if (num3.startsWith('0')) {
              //console.log(num3.substr(1,1))
              num3 = num3.substr(1, 1);
            }
            res.data.list[i].withdrawCash = yd.util.getPriceDouble(res.data.list[i].withdrawCash);
            res.data.list[i].amount = yd.util.getPriceDouble(res.data.list[i].amount);
            res.data.list[i].nextLevelReward = yd.util.getPriceDouble(res.data.list[i].nextLevelReward);
            res.data.list[i].createDateStrNew = num3;
            console.log(res.data.list[i].withdrawCash);
          }
          awardList[awardListIndex] = res.data.list;
          console.log(awardList[awardListIndex]);
          that.setData({
            awardList: awardList,
            hasNextPage: res.data.hasNextPage
          })
          console.log(that.data.awardList[0])
        } else {
          res.msg ? yd.util.commonToast(res.msg) : ''
        }

      }).catch((error) => {
        console.log(res)
        res.msg ? yd.util.commonToast(res.msg) : ''
      })
    }
  },
  //bar选择函数-规则说明
  selectbar1: function() {
    (this.data.barnum != 1) ? this.setData({
      barnum: 1
    }): ""
  },
  //bar选择函数-我的邀请记录
  selectbar2: function() {
    let that = this;
    if (that.data.barnum != 2) {
      (that.data.awardList.length) ? '' : that.getAwardList()
      that.setData({
        barnum: 2
      })
    }
  },
  //关闭弹窗
  shareCancel() {
    getApp().cancelPop(this,'hiddenBl',200);
  },
  shareOpen(){
    getApp().showPop(this,'hiddenBl',200);
  },
  // 邀请
  pullshare: function() {
    let that = this;
    getApp().getUserData(that).then(res => {
    }).catch((error) => {
      if (that.data.vipCardData == null) {
        that.getVipData(true);
      }
      if (that.data.vipCardData != null) {
        that.shareOpen();
      }
        getApp().tdsdk.event({
            id: 'VIP分享点击',
            label: 'VIP分享点击',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    })
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
          that.shareOpen();
        }
      } else {
        yd.util.commonToast(res.msg);
      }

    }).catch((error) => {})
  },
  getUserData: function() {


  },
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

  sendCircle() {
    let that = this;
    that.shareCancel();
    let userData=wx.getStorageSync('userinfo')
    wx.navigateTo({
      url: '/packagepower/pages/sharevip/sharevip?userName=' + userData.nickName + "&userIcon=" +
        userData.avatarUrl + "&qrCode=" + that.data.vipCardData.wxImg
    })
      getApp().tdsdk.event({
          id: 'VIP分享-朋友圈',
          label: 'VIP分享-朋友圈',
          params: {
              from: wx.getStorageSync('userId')
          }
      });
  },
  // isVip: function() {
  //   let that = this;
  //   if (wx.getStorageSync("levelType") != null && wx.getStorageSync("levelType") > 1) {
  //     console.log(wx.getStorageSync("levelType"));
  //     that.setData({
  //       vipBl: true,
  //     });
  //     console.log(this.data.levelType)
  //   }
  // },
  //空点击事件
  kong: function() {},
  backenter: function() {
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },
  backenter1:function(){
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.hideShareMenu({});
    if (wx.getStorageSync('levelType') > 1) {
      that.setData({ getAwardListBL: true })
      that.getRuleNum()
      that.getVipData()
      wx.getStorageSync('userinfo') ? wx.showShareMenu({ withShareTicket: true }) : ""
    } else {
      wx.login({
        success: res => {
          let code = res.code // 登录拿到的code
          let appId = yd.api.getAppId() // 小程序的appId
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/user/miniLogin/${code}/${appId}`, 'app'),
          }).then(res => {
            console.log(res)
            switch (res.code) {
              case 0:
                yd.util.setLocalData('token', res.data.token)
                yd.util.setLocalData('levelType', Number(res.data.levelType))
                yd.util.setLocalData('userId', res.data.id)
                yd.util.setLocalData('inviteCode', res.inviteCode)
                if (res.data.token && res.data.levelType > 1) {
                  that.setData({ getAwardListBL: true })
                  that.getRuleNum();
                  that.getVipData()
                  wx.getStorageSync('userinfo') ? wx.showShareMenu({withShareTicket: true}):""
                } else {
                  that.setData({
                    backfillBL: true
                  })
                }
                break
              case 40002:
                yd.util.setLocalData('ticket', res.data.ticket)
                that.setData({
                  backfillBL: true
                })
                break
              default:
                yd.util.commonToast(res.msg)
                that.setData({
                  backfillBL: true
                })
                break
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }
      })
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
    if (this.data.hasNextPage && this.data.barnum == 2) {
      this.getAwardList();
    }
  },
  nullEvent: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
      getApp().tdsdk.event({
          id: 'VIP分享-群会话',
          label: 'VIP分享-群会话',
          params: {
              from: wx.getStorageSync('userId')
          }
      });
    // yd.util.log(this.data.vipCardData.inviteCode)
    // yd.util.log("&userId=" + wx.getStorageSync('userId'))
    let that = this;
    let userData=wx.getStorageSync('userinfo')
    that.shareCancel();
      getApp().tdsdk.share({
          title: userData.nickName + `邀请你开通悦店VIP`,
          path: '/pageageuser/pages/joinvip/joinvip?inviteCode=' + that.data.vipCardData.inviteCode + "&userId=" + wx.getStorageSync('userId')
      });

      return {
      title: userData.nickName + `邀请你开通悦店VIP`,
      imageUrl: 'https://img.iyuedian.com/mini/share/chat_vip.png',
      path: '/pageageuser/pages/joinvip/joinvip?inviteCode=' + that.data.vipCardData.inviteCode + "&userId=" + wx.getStorageSync('userId')
    }
  }
})
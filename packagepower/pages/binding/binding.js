// pages/binding/binging.js
// 绑定手机号，微信登录
const yd = getApp().globalData;
// 继承ajax请求
Page({
    /**
     * 页面的初始数据
     */
    data: {
        phoneBbl: false,
        codeBbl: false,
        already: true,
        codetext: "发送验证码",
    },
    // 输入手机号
    phoneIp: function(e) {
        let that = this;
        let phoneBbl = /^(1[3-9][0-9])\d{8}$/.test(e.detail.value);
        that.setData({ phoneNum: e.detail.value, phoneBbl: phoneBbl })
    },
    codeIp: function(e) {
        let that = this;
        let codeBbl = e.detail.value.length == 6
        that.setData({ codeNum: e.detail.value, codeBbl: codeBbl })
    },
    errMessage: function(e) {
        yd.util.commonToast("请正确填写手机号");
    },
    codeSend: function() {
        let that = this;
        let phone = that.data.phoneNum;
        let _phone = yd.util.checkPhone(phone)
        if (!_phone.status) {
            yd.util.commonToast(_phone.msg)
        } else {
            yd.ajax({
                method: 'POST',
                url: yd.api.getUrl(`/user/sendMsg/${phone}`, 'app')
            }).then(res => {
                console.log(res)
                if (res.code === 0) {
                    yd.util.commonToast("验证码已发送");
                    let times = 60;
                    that.setData({ already: false });
                    time();
                    function time() {
                        times--;
                        if (times === 0) {
                            that.setData({ codetext: "获取验证码", already: true });
                        } else {
                            let codetext = "已发送 " + times + " s";
                            that.setData({ codetext: codetext });
                            console.log(that.data.codetext);
                            setTimeout(function() {
                                time()
                            }, 1000)
                        }
                    }
                } else {
                    res.msg ? yd.util.commonToast(res.msg) : ''
                }
            }).catch((error) => {
                console.log('error', error)
            })
        }
    },
    phoneBind: function() {
        let that = this;
        let phone = that.data.phoneNum;
        let veriFyCode = that.data.codeNum;
        let token = wx.getStorageSync('token')
        // yd.util.commonToast("请求接口") 
        console.log(token)
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/user/bindPhone/${phone}/${veriFyCode}`, 'app')
        }).then(res => {
            console.log(res)
            if (res.code === 0) {
                yd.util.commonToast("绑定成功");
                yd.util.clearLocalData('token')
                wx.setStorageSync('phoneBlNew', 2);
                getApp().login().then(res => {
                  // wx.setStorageSync('levelType', 2)
                  if (wx.getStorageSync("levelType")>1){
                    wx.showModal({
                      title: '提示',
                      content: '恭喜您，已经获得了悦店VIP身份！',
                      showCancel: false,
                      confirmText: '知道了',
                      success: function (res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            delta: -1
                          });
                        }else{
                          wx.navigateBack({
                            delta: -1
                          });
                        }
                      },
                      fail:function(){
                        wx.navigateBack({
                          delta: -1
                        });
                      }
                      
                    })
                  }else{
                    wx.navigateBack({
                      delta: -1
                    });
                  }
                }).catch(res=>{    
                  res.msg ? yd.util.commonToast(res.msg) : ''
                })
            } else {
                res.msg ? yd.util.commonToast(res.msg) : ''
            }
        }).catch((error) => {
            console.log('error', error)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      wx.hideShareMenu()
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
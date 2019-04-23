// utils/dialog/dialog.js
const yd = getApp().globalData;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      //this.triggerEvent("cancelEvent");
      this.hideDialog()
      // this.triggerEvent('myCalla', {})
    },
    _confirmEvent(res) {
      //触发成功回调
      // console.log(res)
      let that =this;
      this.hideDialog();
      yd.util.loading("加载中", true);
      let userData = res.detail;
      if (userData.userInfo) {
        userData.userInfo.nickName=yd.util.filterEmoji(userData.userInfo.nickName);
        userData.userInfo.nickName = userData.userInfo.nickName.length > 4 ? userData.userInfo.nickName.substr(0, 4) + "..." : userData.userInfo.nickName;
        wx.setStorageSync("userinfo", userData.userInfo);
        that.triggerEvent('openCallb', {})
        if (wx.getStorageSync('ticket') && !wx.getStorageSync('token')) {
          let getdata = {};
          getdata.encryptedData = userData.encryptedData;
          getdata.signature = userData.signature;
          getdata.rawData = userData.rawData;
          getdata.iv = userData.iv;
          let appCode = yd.api.getAppId();
          let ticket = wx.getStorageSync('ticket');
          console.log(ticket)
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/user/miniAuth/${appCode}/${ticket}`, 'app'),
            data: getdata,
            header:{
              token:""
            }
          }).then(res => {
            console.log(res)
            switch (res.code) {
              case 0:
                wx.setStorageSync('token', res.data.token)
                wx.removeStorage('tictek')
                that.triggerEvent('myCallb', {})
                break
              case -2:
                res.msg ? util.commonToast(res.msg) : ''
                break
              default:
                res.msg ? util.commonToast(res.msg) : ''
                break
            }
            wx.hideLoading();
          }).catch((error) => {
            res.msg ? util.commonToast(res.msg) : ''
            wx.hideLoading();
          })
        }
        else {
          wx.hideLoading();
        }
      } else {
        wx.hideLoading();
      }
      // this.triggerEvent("confirmEvent");
    },
    // _confirmEvent() {
      
    // }
  }
})
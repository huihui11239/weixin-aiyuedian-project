// pages/addressmanagement/addressmanagement.js
const yd = getApp().globalData
// 地址管理
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    list: [],
    height: 0,
    scrollY: true,
    show: false,
    isIphoneX: wx.getStorageSync('isIphoneX'),
    dataShow: false,//是否展示没有了
    pageNum: 1,//初分页默认值
  },
  /**
   * 新增地址按钮
   */
  newAdd: function () {
    let that = this;
    // that.setData({ newAddBl: true })
    var itemList = ['手动填写(推荐使用)','选择微信的地址信息']
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (!res.cancel) {
          switch (itemList[res.tapIndex]){
            case '手动填写(推荐使用)':
                that.writeAdd();
                break;
            case '选择微信的地址信息':
              that.wxAdd()
             break;
          }
          console.log(itemList[res.tapIndex])
        }
      }
    })
  },
  //填充
  kong: function () {
    let that = this;
    console.log("ddd")
  },
  //选择微信地址
  wxAdd: function () {
    let that = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.address'])
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              that.chooseAddress()
            }, fail() {
              getApp().goSetting("地址权限")
            }
          })

        } else {
          that.chooseAddress()
          console.log('当前微信版本不支持chooseAddress');
        }
      }
    })

    console.log("ddd")
  },
  /**
  * 调取微信授权
  */
  chooseAddress() {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(JSON.stringify(res));
        console.log(res);
        let form = {
          province: res.provinceName,//省
          city: res.cityName,//市
          area: res.countyName,//区
          street: res.detailInfo,//详细地址
          isDefault: 0,//默认地址
          nationalCode: res.nationalCode,//国家行政编号
          postcode: res.postalCode,//邮政编码
          reveiverPhone: res.telNumber,//收货人手机号
          receiverName: res.userName,//收货人姓名
        }
        yd.ajax({
          method: 'POST',
          url: yd.api.getUrl(`/user/address/save`, 'app'),
          data: form
        }).then(res => {
          console.log(res)
          if (res.code == 0) {
            // that.emptyData();//清空数据返回第一次
          }
        }).catch((error) => {
          console.log('error', error)
        })
      },
      fail: function (err) {

      }
    })
  },
  // 手动填写
  writeAdd: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: '../../../packagebuy/pages/newadd/newadd',
    })
  }),
  /**
   * 设置默认地址
   */
  setUpdefault(e){
    let that = this
    console.log(e.currentTarget.dataset.item)
    if (e.currentTarget.dataset.item.isDefault==1){
      return
    }
    e.currentTarget.dataset.item.isDefault = 1
      that.addressCheck(e.currentTarget.dataset.item)
        .then(() => {
          yd.ajax({
              method: 'POST',
              url: yd.api.getUrl(`/user/address/edit`, 'app'),
              header: {
                  'token': wx.getStorageSync('token')
              },
              data: e.currentTarget.dataset.item
          }).then(res => {
              console.log(res)
              if (res.code == 0) {
                  wx.showToast({
                      title: '设置成功',
                      icon: 'none',
                      duration: 2000
                  })
                  yd.util.setLocalData('defaultAddress', e.currentTarget.dataset.item);
                  that.emptyData();//清空数据返回第一次
              }
          }).catch((error) => {
              console.log('error', error)
          })
        })

  },
  /**
   * 删除地址
   */
  moveblockDeleting(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: function (res) {
        console.log(e.currentTarget.dataset)
        if (res.confirm) {
          yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/user/address/delete/${e.currentTarget.dataset.item}`, 'app'),
            header: {
              'token': wx.getStorageSync('token')
            }
          }).then(res => {
            console.log(res)
            if (res.code == 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              });
              if (e.currentTarget.dataset.type.isDefault == 1){
                yd.util.clearLocalData('defaultAddress')
              }
              if (yd.address){
                if (yd.address.id == e.currentTarget.dataset.item){
                  yd.address = null
                }
              }
              _this.emptyData();//清空数据返回第一次
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }
      }
    })
  },
  /**
   * 编辑地址
   */
  moveblockEdit: yd.util.notDoubleClick(function (e) {
    wx.navigateTo({
      url: `../../../packagebuy/pages/newadd/newadd?id=${e.currentTarget.dataset.item}`,
    })
  }),
  //取消新增
  cancelAdd: function () {
    let that = this;
    that.setData({ newAddBl: false })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.hideShareMenu()
    console.log(options)
    // this.startAddressList()
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
    let that = this;
    that.emptyData();//清空数据返回第一次
    that.setData({ newAddBl: false });
  },
  /**
   * 清空数据
   */
  emptyData(){
    this.setData({
        list: [],//当前的数据
        pageNum: 1, //当前分页
        total: '', //总长度
        dataShow: false, //默认不展示
    });
    // setTimeout(function () {
        this.startAddressList();
    // },100)
  },
  /**
   * 地址列表加载
   */
  startAddressList() {
    let that = this;
      /*
      * 分页 tangjinjin 2018_10_26
      */
      yd.ajax({
      method: 'GET',
      url: yd.api.getUrl(`/user/address/listPage?pageNum=${this.data.pageNum}`, 'app')
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        console.log(res)
        this.setData({
            list: that.data.list.concat(res.data.list),//当前的数据
            total: res.data.pages, //总长度
        });
        if (this.data.pageNum>=res.data.pages){//当前分页数大于等于总分页显示已够了
            this.setData({dataShow: true})
        }else {
            this.setData({dataShow: false})
        }
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].isDefault == 1) {
            yd.util.setLocalData('defaultAddress', res.data.list[i])
          }
          if (yd.address) {
            if (yd.address.id == res.data.list[i].id) {
              yd.address = res.data.list[i]
            }
          }
        }
        this.setData({ show: false });
      } else if (res.code === 41000) {
        this.setData({ list: [] });
        this.setData({ show: true });
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
      
    })
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
   * 判断当前地址是否可以配送(然后跳转) jinjinjin 2018-11-13
   */
  addressCheck(item){
      return new Promise((resolve, reject) => {
          yd.ajax({
              method: 'post',
              url: yd.api.getUrl(`/user/address/check/${item.id}`, 'app')
          }).then(res => {
              if (res.code === 0) {
                  resolve()
              } else if (res.code === 41003) {
                  wx.showModal({
                      content: `${res.msg}`,
                      showCancel: false,
                      success (res) {
                          if (res.confirm) {
                              wx.navigateTo({
                                  url: `../../../packagebuy/pages/newadd/newadd?id=${item.id}`,
                              })
                          }
                      }
                  });
                  reject()
              } else if (res.code === 41002) {
                  res.msg ? yd.util.commonToast(res.msg) : '';
                  reject()
              } else {
                  res.msg ? yd.util.commonToast(res.msg) : '';
                  reject()
              }
          })
      })
  },
  /**
   * 选择跳转
   */
  moveblockChoice(e) {
    yd.address = e.currentTarget.dataset.item
    wx.navigateBack({
      delta: 1//默认值是1，返回的页面数，如果 delta 大于现有页面数，则返回到首页。
    })
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
    let that = this;
    if (that.data.pageNum<that.data.total) {//判断当前有下一页
        this.setData({pageNum: ++this.data.pageNum});
        this.startAddressList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})
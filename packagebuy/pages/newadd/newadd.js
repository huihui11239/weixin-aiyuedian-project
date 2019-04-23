// pages/newadd/newadd.js
// 新增收货人地址
const yd = getApp().globalData
var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      province: '',//省
      city: '',//市
      area: '',//区
      street: '',//详细地址
      isDefault: 0,//默认地址
      nationalCode: '',//国家行政编号
      postcode: '',//邮政编码
      reveiverPhone: '',//收货人手机号
      receiverName: '',//收货人姓名
    },
    cityShow:false,
    isDefault:false,
    warnSize: 'default',
    loading: false,
    plain: false,
    disabled: false,
    show: show,
    provinces: [],
    citys: [],
    countys: [],
    value: [0, 0, 0],
    orderIndex: 1,
    val: [0, 0, 0],
    isIphoneX: wx.getStorageSync('isIphoneX'),
    state: 0,
    system: 'ios'
  },
  /**
   * 获取输入框内容
   */
  getInputValue(e) {
    let name = e.currentTarget.dataset.input
    if (name =='isDefault') { //单选框使用转化
      e.detail.value = Number(e.detail.value)
    }
    
    var system = wx.getSystemInfoSync()
    this.data.form[name] = e.detail.value
    if (system.system.slice(0, 3) == 'iOS' && name == 'reveiverPhone') {
      e.detail.value = e.detail.value+''
      // var reg = new RegExp("?", "");
      // var a = e.detail.value.replace(reg, "");
      e.detail.value = e.detail.value.replace(/[^\d]/g, '')
      e.detail.value = e.detail.value.replace(/\s+/g, '')
      this.data.form[name] = e.detail.value
      this.setData({ form: this.data.form })
      // console.log(a.length);　
    }
    
    // this.setData({form:{ [name]: e.detail.value }})
    console.log(this.data)
  },
  setDefault:function(e){
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.state){
      this.data.state = options.state
    }
    cellId = options.cellId;
    wx.hideShareMenu()
    var that = this;
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
    }
    // /area/detail /
    //获取省市区县数据
    yd.ajax({
      method: 'post',
      url: yd.api.getUrl(`/area/detail/0`, 'app')
    }).then(res => {
      if (res.code === 0) {
        console.log(res.data)
        this.setData({
          provinces: res.data
        })
        //获取市份数据
        getProvinceData(that,that.data.provinces[0].areaCode,1);
        if (options.id) {
          that.data.form.id = options.id
          that.editaddress(options.id)
        }
        
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    })
    var system = wx.getSystemInfoSync()
    if (system.system.slice(0, 3) =='iOS'){
      that.setData({
        system: 'iOS',
      })
    }else{
      that.setData({
        system: 'android',
      })
    }
  },
  /**
   * 保存并使用
   */
  newAdd(){
    let that = this
    console.log(this.data.form)
    let status = this.checkFormat(this.data.form)
    if (status){
      let url = ''
      if (this.data.form.id){
        url = yd.api.getUrl(`/user/address/edit`, 'app')
      }else{
        url = yd.api.getUrl(`/user/address/save`, 'app')
      }
      yd.ajax({
        method: 'POST',
        url: url,
        data: this.data.form
      }).then(res => {
        if (res.code == 0) {
          if (that.data.state==1){
            yd.address = res.data
            wx.navigateBack({
              delta: 2//默认值是1，返回的页面数，如果 delta 大于现有页面数，则返回到首页。
            })
          }else{
            wx.navigateBack({
              delta: 1//默认值是1，返回的页面数，如果 delta 大于现有页面数，则返回到首页。
            })
          }
          
        }else{
            yd.util.commonToast(res.msg)
        }
      }).catch((error) => {
        console.log('error', error)
      })
    }
  },
//   function Trim(str, is_global)
//   {
//     var result;
//     result = str.replace(/(^\s+)|(\s+$)/g, "");
//     if(is_global.toLowerCase() == "g")
// {
//   result = result.replace(/\s/g, "");
// }
// return result;
// }
  /**
   * 表单验证
   */
  checkFormat(params){
    console.log(params)
    // 校验收货人
    let _receiverName = yd.util.checkReceiverName(params.receiverName)
    if (!_receiverName.status) {
      yd.util.commonToast(_receiverName.msg)
      return false
    }
    // 校验手机号
    let _phone = yd.util.checkPhone(params.reveiverPhone)
    if (!_phone.status) {
      yd.util.commonToast(_phone.msg)
      return false
    }
    // 校验所在地区
    let _area = yd.util.checkArea(params.area)
    if (!_area.status) {
      yd.util.commonToast(_area.msg)
      return false
    }
    // 校验详细地址
    let _street = yd.util.checkStreet(params.street)
    if (!_street.status) {
      yd.util.commonToast(_street.msg)
      return false
    }
    
    return true
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 页面编辑
   */
  editaddress(id){
    let _this = this
    yd.ajax({
      method: 'get',
      url: yd.api.getUrl(`/user/address/detail/${id}`, 'app')
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          form: res.data,
          province: res.data.province,
          city: res.data.city,
          area: res.data.area,
          isDefault: res.data.isDefault == 1 ? true : false
        })
      }
    }).catch((error) => {
      console.log('error', error)
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //滑动事件
  bindChange: function (e) {
    let that = this
    that.val = e.detail.value
    console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != that.val[0]) {
      that.val[1] = 0;
      that.val[2] = 0;
      //获取地级市数据
      getProvinceData(this, this.data.provinces[that.val[0]].areaCode,1).then(()=>{
        that.setData({
            value: [that.val[0], that.val[1], that.val[2]],
            province: that.data.provinces[that.val[0]].areaName,
            city: that.data.citys[that.val[1]].areaName,
            area: that.data.countys[that.val[2]].areaName
        })
        that.data.form.province = that.data.provinces[that.val[0]].areaName
        that.data.form.city = that.data.citys[that.val[1]].areaName
        that.data.form.area = that.data.countys[that.val[2]].areaName
        that.data.form.nationalCode = that.data.countys[that.val[2]].areaCode
        index = that.val;
      });
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != that.val[1]) {
        that.val[2] = 0;
        getCityArr(this, this.data.citys[that.val[1]].areaCode);//获取区县数据
        index = that.val;
      }else{
        getCityArr(this, this.data.citys[that.val[1]].areaCode);//获取区县数据
        index = that.val;
      }
    }
    

    console.log(index + " => " + that.val);

   
    
  },
  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    let _this = this
    // if (t == 0) {
    //   moveY = 0;
    //   show = false;
    //   t = 1;
    // } else {
    //   moveY = 200;
    //   show = true;
    //   t = 0;
    // }
    if (_this.data.form.id && _this.data.orderIndex==1){
      ++_this.data.orderIndex
      for (let i = 0; i < _this.data.provinces.length; i++) {
        if (_this.data.provinces[i].areaName == _this.data.form.province) {
          //获取省份数据
          getProvinceData(_this, _this.data.provinces[i].areaCode, 1, i);
        }
      }
    }
    ++_this.data.orderIndex
    // this.animation.translate(arr[0], arr[1]).step();
    // animationEvents(this, moveY, show);
    this.setData({
      cityShow: true,
    })
  },
  //隐藏弹窗浮层
  hiddenFloatView1(){
    this.setData({
      cityShow: true,
    })
  },
  hiddenFloatView(e) {
    console.log(e);
    let that = this
    moveY = 200;
    show = true;
    t = 0;
    if (that.data.form.area==''){
      //更新数据
      // setTimeout(function () {
        that.setData({
          value: [0, 0, 0],
          province: that.data.provinces[0].areaName,
          city: that.data.citys[0].areaName,
          area: that.data.countys[0].areaName
        })
        that.data.form.province = that.data.provinces[0].areaName
        that.data.form.city = that.data.citys[0].areaName
        that.data.form.area = that.data.countys[0].areaName
        that.data.form.nationalCode = that.data.countys[0].areaCode
      // }, 200);
    }
    // animationEvents(this, moveY, show);
    this.setData({
      cityShow: false,
    })

  },
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  }
})

//动画事件
function animationEvents(that, moveY, show) {
  // console.log("moveY:" + moveY + "\nshow:" + show);
  // that.animation = wx.createAnimation({
  //   // transformOrigin: "50% 50%",
  //   duration: 400,
  //   timingFunction: "ease",
  //   delay: 0
  // }
  // )
  // that.animation.translateY(moveY + 'vh').step()

  // that.setData({
  //   animation: that.animation.export(),
  //   show: show
  // })
  this.setData({
    cityShow: true,
  })
}

// ---------------- 分割线 ---------------- 

//获取市区数据
function getProvinceData(that, areaCode, index, provinceIndex) {
    return new Promise((resolve, reject) => {
        yd.ajax({
            method: 'post',
            url: yd.api.getUrl(`/area/detail/${areaCode}`, 'app')
        }).then(res => {
            if (res.code === 0) {
                that.setData({
                    citys: res.data
                })
                if (provinceIndex){
                    for (let i = 0; i < that.data.citys.length; i++) {
                        if (that.data.citys[i].areaName == that.data.form.city) {
                            getCityArr(that, that.data.citys[i].areaCode, provinceIndex, i);
                        }
                    }
                }else{
                    if (index) {
                        getCityArr(that, that.data.citys[0].areaCode);
                    }
                }
                resolve();


            } else {
                reject();
                res.msg ? yd.util.commonToast(res.msg) : ''
            }
        })
    })

  

  //初始化调一次
  
  // getCountyInfo(0, 0, that);
  

}

// 获取县区数据
function getCityArr(that, areaCode, provinceIndex, cityIndex) {
  yd.ajax({
    method: 'post',
    url: yd.api.getUrl(`/area/detail/${areaCode}`, 'app')
  }).then(res => {
    if (res.code === 0) {
      that.setData({
        countys: res.data
      });
      let getCityArrIndex = 0;
      if (provinceIndex){
        if (that.data.countys.length==0){
          that.setData({
              value: [0, 0, 0]
          })
        } else {
          for (let i = 0; i < that.data.countys.length; i++) {
              if (that.data.countys[i].areaName == that.data.form.area) { // 当前选择了
                ++getCityArrIndex;
                index = [provinceIndex, cityIndex, i];
                that.setData({
                    value: [provinceIndex, cityIndex, i]
                })
              }
          }
          if (getCityArrIndex===0){//当前都没有选中
              that.setData({
                  value: [provinceIndex, cityIndex, 0],
                  province: that.data.provinces[provinceIndex].areaName,
                  city: that.data.citys[cityIndex].areaName,
                  area: that.data.countys[0].areaName
              });
              that.data.form.province = that.data.provinces[provinceIndex].areaName;
              that.data.form.city = that.data.citys[cityIndex].areaName;
              that.data.form.area = that.data.countys[0].areaName;
              that.data.form.nationalCode = that.data.countys[0].areaCode
          }
        }
      }
      //更新数据
      setTimeout(function () {
        if (!that.val){
          return
        }
        that.setData({
          value: [that.val[0], that.val[1], that.val[2]],
          province: that.data.provinces[that.val[0]].areaName,
          city: that.data.citys[that.val[1]].areaName,
          area: that.data.countys[that.val[2]].areaName
        });
        that.data.form.province = that.data.provinces[that.val[0]].areaName
        that.data.form.city = that.data.citys[that.val[1]].areaName
        that.data.form.area = that.data.countys[that.val[2]].areaName
        that.data.form.nationalCode = that.data.countys[that.val[2]].areaCode
      }, 200);
    } else {
      res.msg ? yd.util.commonToast(res.msg) : ''
    }
  })

}

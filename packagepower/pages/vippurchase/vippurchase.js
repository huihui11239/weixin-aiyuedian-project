// packagepower/pages/vippurchase/vippurchase.js
import pagestates from "../../../utils/pagestates/pagestates";
import {
  Provider
} from '../../../utils/provider.js'
const yd = getApp().globalData;
Page(Provider({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    atIndex: 0,
    indexId: "",
    form: [],
    cIndex: "-1",
    vipId: '',
    rstoken: '',
    isIphoneX: wx.getStorageSync('isIphoneX'),
    backHome:false,
    vipgitdata: [{
        name: "法国经典葡萄酒礼包",
        money: "481.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg1.jpg",
        skuCode: 46185,
        numbers: 5,
        comitem: [{
            nameone: "五常有机稻花香粥米2.5kg",
            mum: 1
          },
          {
            nameone: "长寿乡巴马初榨火麻油250ml",
            mum: 2
          },
          {
            nameone: "法国大都会红葡萄酒 750ml",
            mum: 1
          },
          {
            nameone: "澳大利亚莫斯卡托起泡酒750ml",
            mum: 1
          }
        ]
      },
      {
        name: "希腊特级橄榄油礼包",
        money: "428.80",
        url: "https://img.iyuedian.com/mini/govip/gifboximg2.jpg",
        skuCode: 46187,
        numbers: 5,
        comitem: [{

            nameone: "东北长粒香米5kg",
            mum: 1
          },
          {

            nameone: "希腊直采特级橄榄油500ML",
            mum: 1
          },
          {
            nameone: "河套平原红小麦雪花粉2.5kg",
            mum: 1
          },
          {
            nameone: "西班牙特级初榨橄榄油750ML",
            mum: 1
          },
          {
            nameone: "澳大利亚莫斯卡托起泡酒750ml",
            mum: 1
          }
        ]
      },
      {
        name: "海外宝贝护理礼包",
        money: "496.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg3.jpg",
        skuCode: 46189,
        numbers: 7,
        comitem: [{

            nameone: "斯里兰卡初榨椰子油310ml",
            mum: 2
          },
          {

            nameone: "韩国婴幼儿亲肤洗衣液1500ml",
            mum: 2
          },
          {
            nameone: "澳洲纯天然山羊奶手工皂100g",
            mum: 3
          }
        ]
      },
      {
        name: "学生健康成长礼包",
        money: "402.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg4.jpg",
        skuCode: 46191,
        numbers: 5,
        comitem: [{

            nameone: "希腊直采特级橄榄油3L",
            mum: 1
          },
          {

            nameone: "自然果实双色洋葱脆片35g",
            mum: 1
          },
          {
            nameone: "自然果实青萝卜脆片70g",
            mum: 1
          },
          {

            nameone: "自然果实紫薯脆片80g",
            mum: 1
          },
          {

            nameone: "自然果实红薯脆片80g",
            mum: 1
          }

        ]
      },
      {
        name: "不老城希腊养生礼包",
        money: "447.6",
        url: "https://img.iyuedian.com/mini/govip/gifboximg6.jpg",
        skuCode: 46193,
        numbers: 5,

        comitem: [{

            nameone: "青海高原养生红枸杞200g",
            mum: 2
          },
          {

            nameone: "希腊直采特级初榨橄榄油500ml",
            mum: 1
          },
          {
            nameone: "东北黑蜂保护区特产椴树蜜500g",
            mum: 1
          },
          {

            nameone: "自然生态有机黑五宝粉300g",
            mum: 1
          }
        ]
      },
      {
        name: "时光重现焕颜礼包",
        money: "472.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg5.jpg",
        skuCode: 46195,
        numbers: 4,
        comitem: [{

            nameone: "青海高原特产黑枸杞60g",
            mum: 1
          },
          {

            nameone: "澳大利亚莫斯卡托起泡酒750ml",
            mum: 1
          },
          {
            nameone: "焕颜如膠鱼胶原蛋白粉5g*15",
            mum: 2
          }
        ]
      },
      {
        name: "妈咪极致保养礼包",
        money: "447.6",
        url: "https://img.iyuedian.com/mini/govip/gifboximg7.jpg",
        skuCode: 46197,
        numbers: 6,
        comitem: [{

            nameone: "食用菌之都古田整花银耳120g",
            mum: 1
          },
          {

            nameone: "莲乡之宝湘潭通芯白莲子300g",
            mum: 1
          },
          {

            nameone: "干果之乡新疆有机红枣500g",
            mum: 2
          },
          {
            nameone: "澳大利亚莫斯卡托起泡酒750ml",
            mum: 1
          },
          {

            nameone: "养颜秘籍有机红豆薏仁粉300g",
            mum: 1
          }
        ]
      },
      {
        name: "懒人最爱超净礼包",
        money: "472.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg12.jpg",
        skuCode: 46203,
        numbers: 4,
        comitem: [{

            nameone: "只需一勺超浓缩洗衣液 2升",
            mum: 2
          },
          {

            nameone: "天然无残留超浓缩洗碗液500ml",
            mum: 2
          }
        ]
      },
      {
        name: "经典红茶+绿茶礼包",
        money: "486.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg9.jpg",
        skuCode: 46207,
        numbers: 2,
        comitem: [{

            nameone: "直采有机祁门红茶特级礼盒50g*2",
            mum: 1
          },
          {

            nameone: "直采有机黄山毛峰特级礼盒50g*2",
            mum: 1
          }
        ]
      },
      {
        name: "自然果实天然大礼包",
        money: "485.60",
        url: "https://img.iyuedian.com/mini/govip/gifboximg10.jpg",
        skuCode: 46209,
        numbers: 33,
        comitem: [{

            nameone: "自然果实每日谷粒派对20g",
            mum: 8
          },
          {

            nameone: "自然果实黑花芸豆50g",
            mum: 8
          },
          {

            nameone: "自然果实盐焗开心果100g",
            mum: 2
          },
          {

            nameone: "自然果实什锦蔬菜脆片60g",
            mum: 2
          },
          {

            nameone: "自然果实山楂条238g",
            mum: 2
          },
          {

            nameone: "自然果实色色薯条淡盐味80g",
            mum: 2
          }, {

            nameone: "自然果实色色薯条黑胡椒味80g",
            mum: 2
          },
          {

            nameone: "自然果实土耳其杏干100g",
            mum: 3
          },
          {

            nameone: "自然果实冻干龙眼草莓心30g",
            mum: 2
          },
          {

            nameone: "希腊直采特级橄榄油500ml",
            mum: 2
          },
          {

            nameone: "PS：个别子商品出现缺货时会用同价位或高价位商品替换",
            mum: null
          }
        ]

      },
      {
        name: "单身贵族静享生活礼包",
        money: "443.30",
        url: "https://img.iyuedian.com/mini/govip/gifboximg13.jpg",
        skuCode: 48439,
        numbers: 25,
        comitem: [{
            nameone: " 自然果实每日坚果派对25g",
            mum: 5
          },
          {
            nameone: "Mixx梳打饼干香葱味350g",
            mum: 1
          },
          {
            nameone: "自然果实有机甘栗仁100g",
            mum: 2
          },
          {
            nameone: "自然果实青萝卜脆片70g",
            mum: 2
          },
          {
            nameone: "自然果实山楂条238g",
            mum: 2
          },
          {
            nameone: "匠肉炭烤原切猪肉片108g",
            mum: 1
          },
          {
            nameone: "自然果实有机淮盐花生110g",
            mum: 2
          },
          {
            nameone: "山生山食麻辣冷香牛肉80g",
            mum: 2
          },
          {
            nameone: "自然果实色色薯条淡盐味80g",
            mum: 2
          },
          {
            nameone: "自然果实黑花芸豆50g",
            mum: 5
          },
          {
            nameone: "意大利索巴拉格蓝迪蓝布鲁斯科起泡葡萄酒750ml",
            mum: 1
          },
          {
            nameone: "PS：个别子商品出现缺货时会用同价位或高价位商品替换",
            mum: null
          }
        ]
      },
      {
        name: "中秋团圆长“酒”“蟹”礼",
        money: "528.00",
        url: "https://img.iyuedian.com/mini/govip/gifboximg14.jpg",
        skuCode: 49841,
        numbers: 3,
        comitem: [{

          nameone: "2018年春播阳澄湖大闸蟹美礼盒 母蟹2.0两/公蟹3.0两3对",
          mum: 1
        },
        {

          nameone: "意大利索巴拉蓝布鲁斯科桃红起泡葡萄酒750ml",
          mum: 2
        }
        ]
      }
    ]

  },
  //滑动 监听
  scrollVip(e) {
    console.log(e)
    let atIndex = Math.ceil(e.detail.scrollLeft / (e.detail.scrollWidth / this.data.vipGitNew.length));
    if (e.detail.scrollLeft > 200) {
      (atIndex === this.data.atIndex) ? "" : this.setData({
        atIndex: atIndex
      });
    } else {
      (atIndex === this.data.atIndex) ? "" : this.setData({
        atIndex: 0
      });
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.userId) {
      this.initShareData(options.userId);
    }
    (options.userId) ? that.setData({
      userId: options.userId
    }): that.setData({
      userId: 0
    });
    (options.teamuserId) ? that.setData({
      teamuserId: 1
    }): that.setData({
      teamuserId: 0
    });
    (options.direct)? that.setData({backHome:true}):"";

    // console.log(options.teamuserId);
    // (options.teamuserId)? that.getteam(options.teamuserId):"";
    // if(options.teamuserId){
    //     that.setData({teamuserId:options.teamuserId})
    //     that.initShareData(options.teamuserId);
    // }else if(options.userId){
    //   that.setData({userId:options.userId})
    //   that.initShareData(options.userId)
    // }
    this.getGif();
    this.isrsToken();
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // getteam:function(id){
  //     yd.util.loading();
  //     let that = this;
  //     yd.ajax({
  //         method: 'POST',
  //         url: yd.api.getUrl(`/userInvite/userInfo/${id}`, 'app'),
  //     }).then(res => {
  //
  //         wx.hideLoading()
  //         console.log(res)
  //         if (res.code === 0) {
  //             this.setData({ teamuserData: res.data })
  //         } else {
  //             res.msg ? yd.util.commonToast(res.msg) : ''
  //         }
  //     }).catch((error) => {
  //         console.log('error', error)
  //         wx.hideLoading()
  //     })
  // },
  //获取用户头像
  initShareData: function(userId) {
    yd.util.loading();
    let that = this;
    let pageState = pagestates(this)
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/userInvite/userInfo/${userId}`, 'app'),
    }).then(res => {
      pageState.finish()
      wx.hideLoading()
      console.log(res)
      if (res.code === 0) {
        this.setData({
          userData: res.data
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    }).catch((error) => {
      console.log('error', error)
      pageState.error()
      wx.hideLoading()
    })
  },
  //获得礼包信息
  getGif: function() {
    let that = this;
    let siteId = (yd.locaData.siteId)? yd.locaData.siteId : 1
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/goods/vipGoodsList`, 'app'),
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        pageNum: 1,
        pageSize: 20,
        param: {
          siteId: siteId
        }
      }
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        let vipgitdata = that.data.vipgitdata;
        let vipGitNew = new Array();
        res.data[0].nextYearDate = yd.util.formatTime(res.data[0].nextYearDate / 1000, 'Y-M-D');
        for (let i = 0; i < res.data.length; i++) {
          for (let u = 0; u < vipgitdata.length; u++) {
            if (res.data[i].thirdProductId == vipgitdata[u].skuCode) {
              vipgitdata[u].trid = res.data[i].id;
              vipgitdata[u].name = res.data[i].name;
              vipGitNew.push(vipgitdata[u]);
            }
          }
        };
        console.log(vipGitNew)
        this.setData({
          vipGitNew: vipGitNew,
          time: res.data[0].nextYearDate
        })

      } else {
        res.msg ? yd.util.commonToast(res.msg) : ''
      }
    })
  },
  /*
   * 选择大礼包
   */
  giftbagx: function(e) {
    let that = this;
    if (that.data.cIndex === e.currentTarget.dataset.dindex) {
      console.log(e.currentTarget.dataset.dindex)
      this.setData({
        cIndex: "",
        vipId: ""
      })
    } else {
      console.log(e.currentTarget.dataset.dindex)
      // if (yd.address){
      //   let param = {
      //     param: {
      //       countyAreaCode: yd.address.nationalCode,
      //       productData: [{
      //         goodsId: e.currentTarget.dataset.gifid
      //       }]
      //     }
      //   }
      //   that.judge(param)
      // }
      this.setData({
        cIndex: e.currentTarget.dataset.dindex,
        vipId: e.currentTarget.dataset.gifid
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(option) {
    let that=this;
    if (yd.address) {
      this.setData({
        address: yd.address
      })
    }
    // if (yd.address && that.data.vipId) {
    //   let param = {
    //     param: {
    //       countyAreaCode: yd.address.nationalCode,
    //       productData: [{
    //         goodsId: that.data.vipId
    //       }]
    //     }
    //   }
    //   that.judge(param)
    // }
  },

  /**
   * 获取重复提交token
   */
  isrsToken: function() {
    let that = this;
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/rsToken`, 'app'),
      header: {
        'token': wx.getStorageSync('token')
      }
    }).then(res => {
      console.log(res);
      if (res.data.code == 0) {
        that.data.rstoken = res.header.rstoken
      }
    }).catch((error) => {
      console.log('error', error)
    })
  },
  // 判断地址
  // judge: function (obj) {
  //   let that = this;
  //   yd.util.loading('地址判断中')
  //   yd.ajax({
  //     method: 'POST',
  //     url: yd.api.getUrl(`/goods/checkAddressIsDispatching`, 'app'),
  //     data: obj
  //   }).then(res => {
  //     console.log(res)
  //     if (res.code == 0) {
  //       res.data.productData[0].deliveryStartDate? that.setData({ delTime: res.data.productData[0].deliveryStartDate}):''
  //       wx.hideLoading();
  //     } else {
 
  //       wx.hideLoading();
  //       res.msg ? yd.util.commonToast(res.msg) : "";
  //     }
  //   }).catch((error) => {
     
  //     wx.hideLoading();
  //     res.msg ? yd.util.commonToast(res.msg) : "";
  //   })
  // },
  /**
   * 提交订单
   */
  submitOrder: yd.util.notDoubleClick(function() {
    let that = this;
    if (that.data.vipId == '') {
      yd.util.commonToast('请选择一个大礼包');
      return
    }
    if (!yd.address) {
      yd.util.commonToast('请选择商品收货地址');
      return
    }
    let orderdata = this.data.orderdata;
    let params = {
      productVoList: [{
        itemNum: 1,
        cpsUser: that.data.userId,
        productId: that.data.vipId,
        shipmentType: 3
      }],
      tradeSource: 1,
      addressId: yd.address.id,
    };
    yd.ajax({
      method: 'POST',
      url: yd.api.getUrl(`/trade/createVipTrade`, 'app'),
      header: {
        token: wx.getStorageSync('token'),
        rstoken: that.data.rstoken
      },
      data: JSON.stringify(params)
    }).then(res => {
      console.log(res);
      if (res.code === 0) {
        let orderId = res.data.trade.id;
        wx.redirectTo({
          url: `../../../pageageuser/pages/orderdetails/orderdetails?id=${orderId}&pay=1&tag=VIP礼包页`,
        })
      } else {
        res.msg ? yd.util.commonToast(res.msg) : ""
      }
    }).catch((error) => {

    })
  }),
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
   * 购买vip
   */
  govippay() {

  },
  /**
   * 选择地址
   */
  choiceAddress() {
    wx.navigateTo({
      url: '/packagebuy/pages/manageadd/manageadd',
    })
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
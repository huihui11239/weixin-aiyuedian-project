import { Provider } from '../../../utils/provider.js'
const yd = getApp().globalData
Component(Provider({
  
	properties: {
    top: {
      type: Number,
      value: ' ',
      linked: function (target) {
        console.log(target)//钩子函数，在组件linked时候被调用target是组件的实例，
      }
    },
		customStyle: {
			type: String,
			value: ''
		},
    statusFlag:{
      type:String,
      value:-1
    },
    acttype:{
      type: String,
      value:'1'
    }
	},
  data: {
    isIphoneX: wx.getStorageSync('isIphoneX')
  }, 
  ready(){
    
    let that = this
    if (
      yd.util.getPagesRoute() != '/pages/home/home' &&
      yd.util.getPagesRoute() != '/pages/classify/classify' &&
      yd.util.getPagesRoute() != '/pages/mine/mine' &&
      yd.util.getPagesRoute() != '/pages/vip/vip'
    ) {
      that.setData({ getPagesRoute: true });
    }
    if (
      yd.util.getPagesRoute() == '/pages/home/home' ||
      yd.util.getPagesRoute() == '/pages/classify/classify'
    ) {
      if (wx.getStorageSync("levelType") < 2) {
        that.setData({ vipshow: true });
      } else {
        that.setData({ vipshow: false });
      }
    }
    // console.log(yd.util.getPagesRoute())
    if (
      // yd.util.getPagesRoute() == '/packagebuy/pages/details/details' ||
      yd.util.getPagesRoute() == '/packagebuy/pages/payresult/payresult' ||
      yd.util.getPagesRoute() == '/pageageuser/pages/orderdetails/orderdetails' ||
      yd.util.getPagesRoute() == '/packagepower/pages/earnings/earnings' ||
      yd.util.getPagesRoute() == '/pageageuser/pages/jointeam/jointeam' ||
      yd.util.getPagesRoute() == '/pageageuser/pages/joinvip/joinvip' ||
      yd.util.getPagesRoute() == '/packagepower/pages/partner/partner'||
      yd.util.getPagesRoute() == '/packagepower/pages/limittime/limittime' ||
      yd.util.getPagesRoute() == '/packagepower/pages/memberdel/memberdel'||
      yd.util.getPagesRoute() == '/packagepower/pages/searchmem/searchmem' ||
      yd.util.getPagesRoute() == '/packagepower/pages/vipbalance/vipbalance'||
      yd.util.getPagesRoute() == '/packagebuy/pages/spelllist/spelllist' ||
      yd.util.getPagesRoute() == '/packagebuy/pages/spelldel/spelldel'||
      yd.util.getPagesRoute() == '/packagepower/pages/vippurchase/vippurchase' 
    ) {
      that.setData({ homeshow: true });
    }
    if (yd.util.getPagesRoute() == '/pages/mine/mine') {
      that.setData({ floorstatus: false });
    }
    if (yd.util.getPagesRoute() == '/packagebuy/pages/details/details') {
      that.setData({ limittime: true });
    }
    let start = 1 
    this.page.$on('onPageScroll',(res)=>{
      if (yd.util.getPagesRoute() == '/pages/mine/mine'){
        that.setData({ floorstatus: false });
      }else{
        if (res.scrollTop > 500) {
          if (that.data.timeIndex==1){
            that.setData({ floorstatus: true, timeIndex: 2 });
            setTimeout(function () {
              that.setData({ floorstatus: false, timeIndex: 1 });
            }, 2000)
          }
          
        } else {
          that.setData({ floorstatus: false });
        }
      }
      if (wx.getStorageSync("levelType")>1) {
        start++
        that.setData({ vipshow: false });
      }
    })
    this.page.$on('onShow', (res) => {
      if (
        yd.util.getPagesRoute() == '/pages/home/home' ||
        yd.util.getPagesRoute() == '/pages/classify/classify'
      ) {
        if (wx.getStorageSync("levelType") < 2) {
          that.setData({ vipshow: true });
        }else{
          that.setData({ vipshow: false });          
        }
      }
      console.log("烫金金组件运行");
      that.setData({ floorstatus: false });
    })
    if (
      yd.util.getPagesRoute() == '/pages/home/home'||
      yd.util.getPagesRoute() == '/pages/classify/classify' ||
      yd.util.getPagesRoute() == '/pageageuser/pages/jointeam/jointeam' ||
      yd.util.getPagesRoute() == '/pageageuser/pages/joinvip/joinvip' ||
      yd.util.getPagesRoute() == '/packagebuy/pages/details/details'||
      yd.util.getPagesRoute() == '/packagebuy/pages/searchresult/searchresult'||
      yd.util.getPagesRoute() == '/packagepower/pages/limittime/limittime' ||
      yd.util.getPagesRoute() == '/packagepower/pages/spelllist/spelllist'||
      yd.util.getPagesRoute() == '/packagepower/pages/limittime/limittime' ||
      yd.util.getPagesRoute() == '/packagepower/pages/memberdel/memberdel'||
      yd.util.getPagesRoute() == '/packagepower/pages/teamdetails/teamdetails'||
      yd.util.getPagesRoute() == '/packagepower/pages/partner/partner'||
      yd.util.getPagesRoute() == '/packagepower/pages/latent/latent'||
      yd.util.getPagesRoute() == '/packagepower/pages/searchmem/searchmem',
      yd.util.getPagesRoute() == '/packagepower/pages/vippurchase/vippurchase'
    ) {
      that.setData({ getPagesRouteshow: false });
    }
  },
  data: {
    floorstatus: false,
    vipshow: false,
    homeshow: false,
    getPagesRouteshow: true,
    getPagesRoute: false,
    timeIndex: 1,
    isIphoneX: wx.getStorageSync('isIphoneX'),
  },
	methods: {
		clickScrollTop() {
      console.log(this.data.top)
			wx.pageScrollTo({
				scrollTop: 0,
				animate: false
			})
			this.triggerEvent('click')
    },
    onchangevip() {
      wx.switchTab({
        url: '/pages/vip/vip'
      })
    },
    onchangehome() {
      wx.switchTab({
        url: '/pages/home/home'
      })
    },
    goLimit(){
      this.triggerEvent('goLimit', "");
    },
    goSpellList() {
      let act={
        acttype:3
      }
      this.triggerEvent('goLimit',act);
    }
	}
})({
  onPageScroll: true,
  onShow: true
}))
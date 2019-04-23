//pages/classify/classify.js
// 分类列表
// 继承ajax请求');

import {
    Provider
} from "../../../utils/provider";

const yd = getApp().globalData;
//import $bus from "../../utils/eventbus.js"
import pagestates from '../../../utils/pagestates/pagestates.js'

Page(Provider({

    /**
     * 页面的初始数据
     */
    data: {
        showbl: true,
        barbl: false,
        vipBl: false,
        orderidJudg: 2,
        hasNextPage: true,
        hisdata:[],
        selectId: 0,
        listCode: {
            pageSize: 500, //总额数
            pageNum: 1, // 第几页
            name: "", //内容
            orderType: 0,
            siteId: 1,
            orderBy: 2
        },
        conditonO: [{
            typeid: 0,
            name: '默认',
            index: 1
        },
            {
                typeid: 2,
                name: '销量',
                index: 2
            },
            {
                typeid: 3,
                name: '价格',
                index: 3
            }
        ],
        conditonT: [{
            typeid: 0,
            name: '默认',
            index: 1
        },
            {
                typeid: 1,
                name: '返现比例',
                index: 2
            },
            {
                typeid: 2,
                name: '销量',
                index: 3
            },
            {
                typeid: 3,
                name: '价格',
                index: 4
            }
        ]
    },
//按钮点击搜索
    formSubmit: function (e) {
        //无搜索内容提示
        let attext = e.detail.value.input.replace(/(^\s*)|(\s*$)/g, "");
        if (!attext) {
            (e.detail.value.input)? this.setData({attext:''}):'';
            yd.util.commonToast("请输入要搜索的商品名称");
            return
        }
        //增加历史新数据
        let hisdata = this.data.hisdata ? this.data.hisdata : new Array();
        let hisindex = hisdata ? hisdata.indexOf(attext) : '';
        //搜索数据查重
        if (hisindex < 0) {
            console.log(hisindex);
            if (hisdata.length === 12) {
                hisdata.splice(11, 1);
                hisdata.splice(0, 0, attext); //最大历史缓存为12，等于12的时候清楚最后一位
            } else {
                hisdata.splice(0, 0, attext);
            }
        } else {
            hisdata.splice(hisindex, 1);
            hisdata.splice(0, 0, attext); //有重复的情况下提升历史数据位置
        }
        wx.setStorageSync('hisdata', hisdata);

        //跳转函数
        this.setData({attext:attext,showbl:false,hasNextPage:true,comSList:'',hisdata:hisdata})
        this.getComList();
    },
    // //按钮点击搜索
    // clicksearch1: function (e) {
    //     //无搜索内容提示
    //     let attext = this.data.attext;
    //     if (!attext) {
    //         yd.util.commonToast("请输入要搜索的商品名称");
    //         return
    //     }
    //     //增加历史新数据
    //     let hisdata = this.data.hisdata ? this.data.hisdata : new Array();
    //     let hisindex = hisdata ? hisdata.indexOf(attext) : '';
    //     //搜索数据查重
    //     if (hisindex < 0) {
    //         console.log(hisindex);
    //         if (hisdata.length === 12) {
    //             hisdata.splice(11, 1);
    //             hisdata.splice(0, 0, attext); //最大历史缓存为12，等于12的时候清楚最后一位
    //         } else {
    //             hisdata.splice(0, 0, attext);
    //         }
    //     } else {
    //         hisdata.splice(hisindex, 1);
    //         hisdata.splice(0, 0, attext); //有重复的情况下提升历史数据位置
    //     }
    //     wx.setStorageSync('hisdata', hisdata);
    //     //跳转函数
    //     this.searchskip(attext);
    // },
    //弹框点击搜索
    clicksearch2: function (e) {
        //无搜索内容提示
        let attext = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
        if (!attext) {
            (e.detail.value)? this.setData({attext:''}):'';
            yd.util.commonToast("请输入要搜索的商品名称");
            return
        }
        //增加历史新数据
        let hisdata = this.data.hisdata ? this.data.hisdata : new Array();
        let hisindex = hisdata ? hisdata.indexOf(attext) : '';
        //搜索数据查重
        if (hisindex < 0) {
            console.log(hisindex);
            if (hisdata.length === 12) {
                hisdata.splice(11, 1);
                hisdata.splice(0, 0, attext); //最大历史缓存为12，等于12的时候清楚最后一位
            } else {
                hisdata.splice(0, 0, attext);
            }
        } else {
            hisdata.splice(hisindex, 1);
            hisdata.splice(0, 0, attext); //有重复的情况下提升历史数据位置
        }
        wx.setStorageSync('hisdata', hisdata);
        //跳转函数
        this.setData({attext:attext,showbl:false,hasNextPage:true,comSList:'',hisdata:hisdata})
        this.getComList();

    },
    timelygettext:function(e){
        console.log(e);
        this.setData({attext:e.detail.value,timely:true})
    },
    //脱离焦点监听
    gettext: function (e) {
        console.log(e);
        this.setData({attext: e.detail.value});
    },
    //删除input内容
    deleteinput: function () {
        this.setData({attext: ""});
    },
    //点击历史
    clickhis: function (e) {
        //选择历史搜索
        this.setData({attext:e.currentTarget.dataset.histext,showbl:false,hasNextPage:true,comSList:''})
        this.getComList();
    },
    //清楚历史记录
    clearhis: function () {
        let that = this
        // 清空缓存跟当前渲染
        wx.showModal({
            content: "确定要清空历史搜索记录吗？",
            confirmText: "清空",
            success: function (res) {
                yd.util.log(res)
                if (res.confirm) {
                    wx.removeStorageSync('hisdata');
                    that.setData({
                        hisdata: []
                    })
                }
            },
        })

    },
    //假搜索框点就
    showsearch1: function () {
        this.setData({showbl:true,focusbl:true })
    },
    //假搜索框中删除点击
    showsearch2: function () {
        this.setData({showbl:true,attext:'',focusbl:true})
    },
    // 条件选择
    conditonClick: function (e) {
        let that = this;
        // let attext = this.data.listCode.;
        // if (!attext) {
        //     yd.util.commonToast("请输入要搜索的商品名称");
        //     return
        // }
        let listCode = that.data.listCode;
        let orderType = e.currentTarget.dataset.typeid;
        let numJudg = listCode.orderType;
        let orderid = listCode.orderBy;
        if (orderType === numJudg) {
            if (orderType === 0) {
                console.log("已经是默认了");
            } else {
                if (orderid === 2) {
                    orderid = 1;
                } else if (orderid === 1) {
                    orderid = 2;
                }
                listCode.orderBy = orderid;
                that.setData({
                    listCode: listCode,
                    hasNextPage: true,
                    comSList: ""
                });
                that.getComList()
            }
        } else {
            orderid = 2;
            listCode.orderType = orderType;
            listCode.orderBy = orderid;
            that.setData({
                listCode: listCode,
                hasNextPage: true,
                comSList: ""
            });
            that.getComList();
        }
    },
    // 获取商品列表
    getComList: function (empty = 1) {
        let that = this;
        if (that.data.hasNextPage) {
            let comList = this.data.listCode;
            comList.name=this.data.attext;
            comList.siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
            comList.orderType = (comList.orderType === 4) ? 0 : comList.orderType;
            comList.pageNum = (that.data.comSList) ? (that.data.comSList.length + 1) : 1;
            let pagesNumA = comList.pageNum - 1;
            let comSList = (that.data.comSList) ? that.data.comSList : new Array();
            let pageState = pagestates(this)
            yd.ajax({
                method: 'POST',
                url: yd.api.getUrl(`/search/goodsList`, 'app'),
                data: comList
            }).then(res => {
                wx.stopPullDownRefresh();
                console.log(res)
                if (res.code === 200) {
                    // for (let i=0; i < res.data.recordList.length; i++){
                    //   res.data.recordList[i].storageNum = res.data.recordList[i].shareStorageNum - res.data.recordList[i].safeStorageNum - res.data.recordList[i].lockStorageNum;
                    // }
                    console.log(res.data.recordList)

                    comSList[pagesNumA] = res.data.recordList;
                    let idindex = 'comid' + pagesNumA;
                    let barbl=(res.data.recordList.length)? true:false;
                    this.setData({
                        comSList: comSList,
                        hasNextPage: res.data.hasNextPage,
                        idindex: idindex,
                        barbl:barbl
                    })
                } else {
                    res.msg ? yd.util.commonToast(res.msg) : ''
                }

            }).catch((error) => {
                pageState.error()
                console.log('error', error)
            })
        } else {
            console.log()
        }
    },
    // 商品跳转
    detSkip: function (e) {
        let comid = e.currentTarget.dataset.comid;
        wx.navigateTo({
            url: '../details/details?comid=' + comid + "&tag=分类页",
        })
    },
    /**
     * 判断vip用户
     */
    isVip: function () {
        let that = this;
        if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType")>1 ) {
            that.setData({
                vipBl: true
            })
        }
    },
    /**
     * 初始化默认选项
     */
    // initData(that) {
    //     that.data.listCode.param.orderType = 0;
    //     that.data.selectId = 1;
    //     that.setData({ listCode: that.data.listCode, selectId: that.data.selectId });
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu();
        (wx.getStorageSync('hisdata'))? this.setData({hisdata:wx.getStorageSync('hisdata')}):'';
        // if (options.text) {
        //     var listCode = this.data.listCode;
        //     listCode.name = options.text;
        //     this.setData({
        //         listCode: listCode
        //     });
        //     this.getComList();
        // }
        //$bus.$emit("toast", "分类页发送信息");
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
        this.isVip();
        console.log(wx.getStorageSync("levelType"))
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
        this.setData({
            hasNextPage: true,
            comSList: ""
        })
        this.getComList()
    },
    onRetry: function () {
        this.getbar();
        this.getComList();
        this.isVip();
        let pageState = pagestates(this)
        pageState.finish()
    },
    goInfo: function () {
        wx.navigateTo({
            url: '/packagepower/pages/retryinfo/retryinfo',
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getComList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})({
    onPageScroll: true,
    onShow: true
}))
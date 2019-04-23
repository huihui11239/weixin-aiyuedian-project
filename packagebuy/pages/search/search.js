// packagebuy/pages/search/search.js
const yd = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hisdata: []
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
        this.searchskip(attext);
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
        this.searchskip(attext);
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
        this.searchskip(e.currentTarget.dataset.histext);
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
    //搜索跳转
    searchskip: function (text) {
        let that = this;
        //关闭当前页面并且
        wx.navigateTo({
            url: "../../../packagebuy/pages/searchresult/searchresult?text=" + text,
            success: function () {
                that.setData({attext: ''})
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let dome=' ';
        if(!dome){
            console.log(123)
        }
        console.log(dome)
      wx.hideShareMenu()
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
        (wx.getStorageSync('hisdata')) ? this.setData({
            hisdata: wx.getStorageSync('hisdata')
        }) : "";
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

    }
})
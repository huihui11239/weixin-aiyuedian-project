// packagepower/pages/queryGID/queryGID.js
const yd = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gidlist: []
    },
    //按钮点击搜索
    formSubmit: function (e) {
        this.initSearch(e)
    },

    //弹框点击搜索
    clicksearch2: function (e) {
       this.initSearch(e)
    },

    initSearch:function(e){
        //无搜索内容提示
        let attext = e.detail.value.input;
        if (!attext) {
            yd.util.commonToast("请输入要搜索的GID");
            return
        }
        let gidlist = this.data.gidlist ? this.data.gidlist : new Array();
        this.removeByValue(gidlist,attext)
        gidlist.splice(0,0,attext)
        this.setData({gidlist:gidlist})
        wx.setStorageSync("gidlist",gidlist)
    },

    removeByValue: function (arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                arr.splice(i, 1);
                break;
            }
        }
    },
    longTap:function(e){
        let that=this
        wx.showModal({
            content:"是否要删除该条记录",
            success:function (res) {
                if (res.confirm){
                    let list=that.data.gidlist
                    that.removeByValue(list,e.currentTarget.dataset.item)
                    that.setData({gidlist:list})
                    wx.setStorageSync("gidlist",list)
                }
            }
        })
        yd.util.log(e.currentTarget.dataset.item)
    },
    clearhis:function(){
        let that=this
        wx.showModal({
            content:"是否要删除所有记录",
            success:function (res) {
                if (res.confirm){
                    that.setData({gidlist:[]})
                    wx.setStorageSync("gidlist",[])
                }
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        (wx.getStorageSync('gidlist')) ? this.setData({
            gidlist: wx.getStorageSync('gidlist')
        }) : "";
        let gidlist = this.data.gidlist ? this.data.gidlist : new Array();
        if (wx.getStorageSync("gid")!="") {
            this.removeByValue(gidlist, wx.getStorageSync("gid"))
            gidlist.splice(0, 0, wx.getStorageSync("gid"))
            this.setData({gidlist: gidlist})
            wx.setStorageSync("gidlist", gidlist)
        }
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
        return {
            title: `群工具`,
            imageUrl: '/img/icon.jpg'
        }
    }
})
// packagepower/pages/sharecard/sharevip.js
const yd = getApp().globalData;
import pagestates from '../../../utils/pagestates/pagestates.js'
const easyCanvas = require('../../../easyCanvas/easyCanvas.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrcodePath: null,
        headImagePath: null,
        userName: null,
        planJoinCount: null,
        teamUserCount: null,
        isSave: false,
        parmar: null,
        mlist:[
            "https://img.iyuedian.com/mini/share/join_img.png",
            "https://img.iyuedian.com/mini/share/vip_page1.png",
            "https://img.iyuedian.com/mini/share/vip_page2.png",
            "https://img.iyuedian.com/mini/share/vip_page3.png"
        ],
        pageIndex:0,
        imgNumber:0,
        mCatchlist:["","","",""],
        isAutoSave:-1,
        isDrawSuccess:false,
        qrcodePath_loc:null,
        shareImage_loc:null,
        headImagePath_loc:null
    },
    drawShareCard: function () {
        let that = this;
        yd.util.log("开始绘制分享卡片");
        //绘制背景图片
        const ctx = wx.createCanvasContext('shareCanvas');
        if (ctx.measureText) {
            easyCanvas.drawImage(ctx,that.data.mCatchlist[0], 0, 0, 608, 920);
            easyCanvas.drawRoundImage(ctx,that.data.headImagePath_loc,70, 840, 31);
            easyCanvas.drawRoundImage(ctx,that.data.qrcodePath_loc,520, 840, 59);
            easyCanvas.drawImage(ctx,that.data.shareImage_loc, 25, 340, 558,396); // 推进去图片
            if (that.data.userName != null && that.data.userName != '') {
                let nameStr = "「" + this.data.userName + "」已开通悦店";
                let nameW = easyCanvas.drawText(ctx,nameStr,24,"#FFFFFF",120, 835,true);
                easyCanvas.drawText(ctx," 快来加入TA的团队吧~",24,"#FFFFFF",120, 865,true);
                easyCanvas.drawImage(ctx,"/img/card_vip.png",128 + nameW, 816, 34, 22); // 推进去图片
            }
            ctx.draw();
            this.drawShareCard1(1)
        }else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                showCancel: false,
                confirmText: '知道了',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                }
            })
        }
        this.setData({
            isSave: true
        })
        getApp().tdsdk.event({
            id: '海报生成-VIP拉新',
            label: '海报生成-VIP拉新',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    },
    drawShareCard1: function (index) {
        let that = this;
        yd.util.log("开始绘制分享卡片");
        //绘制背景图片
        const bgPath = this.data.mCatchlist[index];
        let cavstr='shareCanvas'+index;
        const ctx = wx.createCanvasContext(cavstr);
        easyCanvas.drawImage(ctx,bgPath, 0, 0, 608, 920);
        easyCanvas.drawRoundImage(ctx,that.data.qrcodePath_loc,520,855,59);
        if(that.data.userName!=null&&that.data.userName!='') {
            let nameStr="「"+this.data.userName+"」邀请你加入TA的团队";
            easyCanvas.drawText(ctx,nameStr,24,"#808080",46, 860,true);
        }
        ctx.draw();
        this.setData({
            isSave: true
        })
        if (index<this.data.mlist.length-1){
            this.drawShareCard1(index+1)
        }else {
            that.setData({
                isDrawSuccess:true
            })
        }
        if (this.data.isAutoSave!=-1&&index==this.data.mlist.length-1) {
            switch (this.data.isAutoSave) {
                case 1:
                    this.saveShareCard(false)
                    break;
                case 2:
                    this.saveShareCard(true)
                    break;

            }
            this.setData({isAutoSave:-1})
        }
    },
    catchImage:function(path,key,index=-1){
        let pageState = pagestates(this)
        let that = this;
        wx.downloadFile({
            url: path,
            success: function (res) {
                pageState.finish()
                if (index!=-1) {
                    that.data[key][index]=res.tempFilePath
                    that.setData({
                        [key]: that.data[key]
                    })
                }else {
                    that.setData({
                        [key]: res.tempFilePath
                    })
                }
                that.setData({imgNumber:that.data.imgNumber+1})

                if (that.data.imgNumber==7){
                    that.drawShareCard()
                }
            },
            fail: function (res) {
                wx.hideLoading()
                pageState.error()
            }
        })
    },
    pageChange:function(res){
        yd.util.log(res)
        this.setData({
            pageIndex:res.detail.current
        })
    },
    /**
     * 保存分享图片到相册
     */
    saveShareCard: function (isAll) {
        if (this.data.isDrawSuccess) {
            if (isAll) {
                this.creatImage('shareCanvas')
                this.creatImage('shareCanvas1')
                this.creatImage('shareCanvas2')
                this.creatImage('shareCanvas3')
                wx.showToast({
                    title: '已保存到相册'
                })
            } else {
                let canvastag = 'shareCanvas' + (this.data.pageIndex == 0 ? "" : this.data.pageIndex);
                this.creatImage(canvastag)
                wx.showToast({
                    title: '已保存到相册'
                })
            }
        }else {
            if (isAll){
                this.setData({
                    isAutoSave:2
                })
            }else {
                this.setData({
                    isAutoSave:1
                })
            }
        }

    },
    creatImage:function(canvastag){
        easyCanvas.save2Memory(this,canvastag).then(res=>{
            easyCanvas.save2PhotoAlbum(res);
        });
    },
    /**
     * 保存图片
     */
    saveClick:yd.util.notDoubleClick( function () {
        yd.util.loading("海报保存中")
        let that = this;
        //if (this.data.isSave) {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                that.saveShareCard(true);
                            }, fail() {
                                getApp().goSetting("保存到相册权限")
                            }
                        })
                    } else {
                        that.saveShareCard(true);
                    }
                }
            })
        //}
    }),

    /**
     * 保存图片
     */
    saveClickOne:yd.util.notDoubleClick(function () {
        yd.util.loading("海报保存中")
        let that = this;
        //if (this.data.isSave) {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                that.saveShareCard(false);
                            }, fail() {
                                getApp().goSetting("保存到相册权限")
                            }
                        })
                    } else {
                        that.saveShareCard(false);
                    }
                }
            })
        //}
    }),

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            qrcodePath: options.qrCode,
            headImagePath: options.userIcon,
            planJoinCount: options.planJoinCount,
            teamUserCount: options.teamUserCount,
            parmar: options,
            shareImage:options.shareImage
        });
        let name=options.userName.length>4?options.userName.substr(0,4)+"...":options.userName;
        this.setData({
            userName:name
        });
        this.catchImage(this.data.qrcodePath,'qrcodePath_loc')
        this.catchImage(this.data.headImagePath,'headImagePath_loc')
        this.catchImage(this.data.shareImage,'shareImage_loc')
        for (let i = 0; i <  this.data.mlist.length; i++) {
            this.catchImage(this.data.mlist[i],'mCatchlist',i)
        }
    },

    onRetry: function () {
        this.setData({imgNumber:0})
        this.catchImage(this.data.qrcodePath,'qrcodePath_loc')
        this.catchImage(this.data.headImagePath,'headImagePath_loc')
        this.catchImage(this.data.shareImage,'shareImage_loc')
        for (let i = 0; i <  this.data.mlist.length; i++) {
            this.catchImage(this.data.mlist[i],'mCatchlist',i)
        }
    },
    goInfo: function () {
        wx.navigateTo({
            url: '/packagepower/pages/retryinfo/retryinfo',
        })
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

    }
})
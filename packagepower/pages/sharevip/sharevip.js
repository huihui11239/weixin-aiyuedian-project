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
        bgImage: null,
        qrcode: null,
        headImage: null,
        isSave: false,
        parmar: null,
        mlist:[
            "https://img.iyuedian.com/mini/share/sharevip_bg.png",
            "https://img.iyuedian.com/mini/share/svip_page1.png",
            "https://img.iyuedian.com/mini/share/svip_page2.png",
            "https://img.iyuedian.com/mini/share/svip_page3.png",
            "https://img.iyuedian.com/mini/share/svip_page4.png",
            "https://img.iyuedian.com/mini/share/svip_page5.png",
        ],
        locList:[
            "","","","","",""
        ],
        pageIndex:0,
        headImage_loc:null,
        qrcode_loc:null,
        imgNumber:0,
        isAutoSave:-1,
        isDrawSuccess:false,
    },
    drawShareCard: function () {
        let that = this;
        yd.util.log("开始绘制分享卡片");
        //绘制背景图片
        const ctx = wx.createCanvasContext('shareCanvas');
        if (ctx.measureText) {
            yd.util.log(this.data.locList);
            //背景图
            easyCanvas.drawImage(ctx,this.data.locList[0], 0, 0, 608, 920);
            //头像
            easyCanvas.drawRoundImage(ctx,that.data.headImage_loc,70, 840, 31);
            //小程序
            easyCanvas.drawRoundImage(ctx,that.data.qrcode_loc,520, 840, 59);

            if (that.data.userName != null && that.data.userName != '') {
                let name = that.data.userName.length > 4 ? that.data.userName.substr(0, 4) + "..." : that.data.userName;
                let nameStr = "「" + name + "」已开通悦店";
                let nameW =easyCanvas.drawText(ctx,nameStr,24,"#DDA839",120, 835,true);
                easyCanvas.drawText(ctx," 邀请你也来加入哦~",24,"#DDA839",120, 868,true);
                easyCanvas.drawImage(ctx,"/img/gold_vip.png", 128 + nameW, 816, 34, 22); // 推进去图片
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
        });
        getApp().tdsdk.event({
            id: '海报生成-VIP分享',
            label: '海报生成-VIP分享',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    },
    drawShareCard1: function (index) {
        let that = this;
        yd.util.log("开始绘制分享卡片");
        //绘制背景图片
        const bgPath = this.data.locList[index];
        let cavstr='shareCanvas'+index;
        const ctx = wx.createCanvasContext(cavstr);
        //背景
        easyCanvas.drawImage(ctx,bgPath, 0, 0, 608, 920);
        //小程序码
        easyCanvas.drawRoundImage(ctx,that.data.qrcode_loc,520, 855, 59);

        if(that.data.userName!=null&&that.data.userName!='') {
            let name=that.data.userName.length>4?that.data.userName.substr(0,4)+"...":that.data.userName;
            let nameStr="「"+name+"」已开通悦店";
            let nameW=easyCanvas.drawText(ctx,nameStr,24,"#808080",46, 845,true);
            easyCanvas.drawText(ctx," 邀请你也来加入哦~",24,"#808080",46, 878,true);
            easyCanvas.drawImage(ctx,"/img/gray_vip.png", 54+nameW, 826, 34, 22); // 推进去图片
        }

        ctx.draw();
        yd.util.log("绘制结束")
        this.setData({
            isSave: true
        })
        yd.util.log(this.data.mlist.length+"-----"+index)
        if (index<this.data.mlist.length-1){
            this.drawShareCard1(index+1)
        }else {
            yd.util.log("图片绘制结束")
            that.setData({
                isDrawSuccess:true
            })
        }

        if (this.data.isAutoSave!=-1&&index==this.data.mlist.length-1) {
            yd.util.log("开始保存")
            switch (this.data.isAutoSave) {
                case 1:
                    this.saveShareCard(that,false)
                    break;
                case 2:
                    this.saveShareCard(that,true)
                    break;

            }
            this.setData({isAutoSave:-1})
        }
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
    saveShareCard: function (that,isAll) {
        if (this.data.isDrawSuccess) {
            if (isAll) {
                yd.util.log("保存所有")
                this.creatImage('shareCanvas')
                this.creatImage('shareCanvas1')
                this.creatImage('shareCanvas2')
                this.creatImage('shareCanvas3')
                this.creatImage('shareCanvas4')
                this.creatImage('shareCanvas5')
                wx.showToast({
                    title: '已保存到相册'
                })
            } else {
                yd.util.log("保存单张")
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
        console.log("保存卡片")
        yd.util.loading("海报保存中")
        let that = this;
        // if (this.data.isSave) {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                that.saveShareCard(that,true);
                            }, fail() {
                                getApp().goSetting("保存到相册权限")
                            }
                        })
                    } else {
                        that.saveShareCard(that,true);
                    }
                }
            })
        // }
    }),

    /**
     * 保存图片
     */
    saveClickOne:yd.util.notDoubleClick(function () {
        console.log("保存卡片")
        yd.util.loading("海报保存中")
        let that = this;
        // if (this.data.isSave) {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                that.saveShareCard(that,false);
                            }, fail() {
                                getApp().goSetting("保存到相册权限")
                            }
                        })
                    } else {
                        that.saveShareCard(that,false);
                    }
                }
            })
        // }
    }),

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            qrcodePath: options.qrCode,
            headImagePath: options.userIcon,
            parmar: options
        });
        let name=options.userName.length>4?options.userName.substr(0,4)+"...":options.userName;
        this.setData({
            userName:name
        });
        this.catchImage(this.data.qrcodePath,'qrcode_loc')
        this.catchImage(this.data.headImagePath,'headImage_loc')
        for (let i = 0; i < this.data.locList.length; i++) {
            this.catchImage(this.data.mlist[i],'locList',i)
        }
    },
    catchImage:function(path,key,index=-1){
        let pageState = pagestates(this)
        let that = this;
        wx.downloadFile({
            url: path,
            success: function (res) {
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

                if (that.data.imgNumber==8){
                    pageState.finish()
                    that.drawShareCard()
                }
            },
            fail: function (res) {
                wx.hideLoading()
                yd.util.log("缓存失败"+key+"--"+index)
                pageState.error()
            }
        })
    },
    onRetry: function () {
        yd.util.commonToast("正在重试...")
        this.setData({imgNumber:0})
        this.catchImage(this.data.qrcodePath,'qrcode_loc')
        this.catchImage(this.data.headImagePath,'headImage_loc')
        for (let i = 0; i < this.data.locList.length; i++) {
            this.catchImage(this.data.mlist[i],'locList',i)
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
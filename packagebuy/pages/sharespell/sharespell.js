// pageageuser/pages/sharegoods/sharespell.js
const yd = getApp().globalData;
import pagestates from '../../../utils/pagestates/pagestates.js'

const easyCanvas = require('../../../easyCanvas/easyCanvas.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        delAllData: null,
        qrCodeimage: null,
        goodimage: null,
        headImage: null,
        name: "",
        isSave: false,
        parmar: null,
        vipBl: false,
        isAutoSave: -1,
        isDrawSuccess: false,
        isTime: true,
        headList: [],
        spellData: null,
    },

    // 获得拼团信息
    getSpellDel: function (gid) {
        let that = this;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/group/detail/${gid}`, 'app'),
        }).then(res => {
            if (res.code === 0) {
                if (res.data.group.partakeNumMax > res.data.group.partakeNum) {
                    for (let i = 0; i < res.data.group.partakeNumMax - res.data.group.partakeNum; i++) {
                        res.data.groupOrderList.push(null)
                    }
                }
                that.setData({
                    spellData: res.data
                })
                that.getgoodimg();
                that.getHeadList();
            } else {
                res.msg ? yd.util.commonToast(res.msg) : '';
            }
        })
    },

    draw: function (goodimg, qrcode, arr) {
        let spellData = this.data.spellData;
        const ctx = wx.createCanvasContext('shareCanvas');
        if (ctx.measureText) {
            yd.util.log("绘制")
            ctx.save(); // 先保存状态 已便于画完圆再用
            easyCanvas.drawRoundRect(ctx, '#EDEDED', 0, 0, 676, 932, 20);
            ctx.save();
            easyCanvas.drawRoundRect(ctx, "#FFF", 1, 1, 674, 930, 20);
            ctx.restore();
            //绘制商品图
            easyCanvas.drawImage(ctx, goodimg, 0, 0, 675, 534);
            easyCanvas.drawImage(ctx, "/img/yudianlogo.png", 42, 0, 70, 86);
            //绘制二维码
            easyCanvas.drawImage(ctx, qrcode, 480, 560, 170, 170);
            //拼团tag
            easyCanvas.drawImage(ctx, '/img/spell_share_bar.png', 0, 469, 676, 68);
            ctx.save();
            easyCanvas.drawText(ctx, '【仅剩' + (spellData.group.partakeNumMax - spellData.group.partakeNum) + '个名额】', 32, "#FFF", 100, 516, true);
            if (spellData.showSellBaseCount != null && spellData.showSellBaseCount >= 100) {
                easyCanvas.drawText(ctx, spellData.showSellBaseCount == null ? 0 + "人已购买" : spellData.showSellBaseCount + "人已购买", 20, "#FFF", 520, 512, true);
            }
            ctx.restore();
            ctx.save()
            easyCanvas.drawLongText(ctx, spellData.group.productName, 32, '#000000', 26, 600, 38, 400, 2, true);
            ctx.restore()
            //绘制价格
            let spellTagW = easyCanvas.drawText(ctx, "拼团价", 28, "#FF5A5A", 26, 780, true);
            easyCanvas.drawText(ctx,"¥",28,"#FF5A5A",30+spellTagW, 780);
            let pricestr=spellData.group.activityPrice;
            let priceWidth = easyCanvas.drawText(ctx, pricestr + "", 54, "#FF5A5A", 52 + spellTagW, 784);
            let buyTagW = easyCanvas.drawText(ctx,"单买价",28,'#C5C5C5',72 + spellTagW + priceWidth, 780,true);
            easyCanvas.drawText(ctx,"¥",28,"#C5C5C5",72+spellTagW+ priceWidth + buyTagW, 780);
            let priceWidth1=easyCanvas.drawText(ctx,spellData.productSellPrice,40,"#C5C5C5",92 + spellTagW + priceWidth + buyTagW, 782);
            easyCanvas.drawLine(ctx,72 + spellTagW + priceWidth, 768,92 + spellTagW + priceWidth + buyTagW + priceWidth1, 768,2,"#C5C5C5");
            //绘制团员头像
            for (let i = 0; i < arr.length; i++) {
                if (i < 5) {
                    let left = i * 100 + 25;
                    ctx.restore();
                    if (arr[i] != "/img/spell_head_holder.png") {
                        ctx.save();
                        const grdHead=easyCanvas.createLinearGradient(ctx,left - 2, 855, 74, 0,'#FF8B54','#FF4848');
                        easyCanvas.drawRoundRect(ctx,grdHead,left - 2, 818, 74, 74, 37);
                        ctx.restore();
                    }
                    ctx.save();
                    easyCanvas.drawRoundRect(ctx,"#FFF",left,820,70,70,35);
                    easyCanvas.drawImage(ctx,arr[i],left,820,70,70);
                    ctx.restore();
                    if (i == 0) {
                        ctx.save();
                        const grd=easyCanvas.createLinearGradient(ctx,36, 874, 48, 0,'#FF8B54','#FF4848');
                        easyCanvas.drawRoundRect(ctx,grd, 36, 874, 48, 22, 12);
                        ctx.restore();
                        easyCanvas.drawText(ctx,"团长",15,'#FFF',46,890);
                    }
                }
            }


            let that = this;
            ctx.draw(false,
                function (res) {
                    setTimeout(function () {
                        that.setData({
                            isSave: true
                        })
                        yd.util.log("尝试自动保存")
                        if (that.data.isAutoSave != -1) {
                            yd.util.log("自动保存")
                            that.checkSave();
                            that.setData({isAutoSave: -1})
                        }
                        that.setData({
                            isDrawSuccess: true
                        })
                    }, 2000);
                }
            );
        } else {
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
        let pageState = pagestates(this)
        pageState.finish()
        getApp().tdsdk.event({
            id: '海报生成-拼团',
            label: '海报生成-拼团',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    },

    /**
     * 保存分享图片到相册
     */
    saveShareCard: function (that) {
        easyCanvas.save2Memory(this,"shareCanvas").then(res=>{
            easyCanvas.save2PhotoAlbum(res);
            wx.showToast({
                title: '已保存到相册'
            });
        })
    },
    /**
     * 保存图片
     */
    saveClick: yd.util.notDoubleClick(function () {
        console.log("保存卡片")
        let that = this;
        yd.util.loading("海报保存中")
        // if (this.data.isSave) {
        if (this.data.isDrawSuccess) {
            that.checkSave();
        } else {
            yd.util.log("设置为自动保存")
            that.setData({
                isAutoSave: 1
            })
        }
    }),

    checkSave: function () {
        let that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            that.saveShareCard(that);
                        }, fail() {
                            getApp().goSetting("保存到相册权限")
                        }
                    })
                } else {
                    that.saveShareCard(that);
                }
            }
        })
    },

    // 获取二维码
    getqrCode: function (id) {
        let pageState = pagestates(this)
        let that = this;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/group/shareGroup/${that.data.gid}`, 'app')
        }).then(res => {
            if (res.code === 0) {
                wx.downloadFile({
                    url: res.data,
                    success: function (res) {
                        that.setData({
                            qrCodeimage: res.tempFilePath
                        })
                        yd.util.log(res.tempFilePath)
                        if (that.data.qrCodeimage != null && that.data.goodimage_loc != null && that.data.headList.length >= that.data.spellData.group.partakeNumMax) {
                            that.draw(that.data.goodimage_loc, that.data.qrCodeimage, that.data.headList);
                        }
                    },
                    fail: function (res) {
                        pageState.error()
                        wx.hideLoading()
                    }
                })
            } else {
                pageState.error()
                wx.hideLoading()
            }

        }).catch((error) => {
            pageState.error()
            wx.hideLoading()
            console.log('error', error)
        })
    },
    /**
     * 判断vip用户
     */
    isVip: function (that) {
        if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType") > 1) {
            that.setData({
                vipBl: true
            })
        }
    },

    // 获取商品图片
    getgoodimg: function () {
        let pageState = pagestates(this)
        let that = this;
        wx.downloadFile({
            url: that.data.spellData.deatilCarouselImg,
            success: function (res) {
                that.setData({
                    goodimage_loc: res.tempFilePath
                })
                if (that.data.qrCodeimage != null && that.data.goodimage_loc != null && that.data.headList.length >= that.data.spellData.group.partakeNumMax) {
                    that.draw(that.data.goodimage_loc, that.data.qrCodeimage, that.data.headList);
                }
            },
            fail: function (res) {
                pageState.error()
                wx.hideLoading()
            }
        })
    },

    /**
     * 获取头像
     * */
    getHeadList: function () {
        this.setData({
            headList: []
        })
        this.downHead(this.data.headList)
    },
    /**
     * 下载头像
     * */
    downHead: function (arr, i = 0) {
        let that = this;
        let headListData = that.data.spellData.groupOrderList;
        yd.util.log(i + "--" + headListData.length)
        if (i < headListData.length) {
            if (headListData[i] != null && headListData[i].userImg) {
                wx.downloadFile({
                    url: headListData[i].userImg,
                    success: function (res) {
                        arr.push(res.tempFilePath)
                        that.downHead(arr, ++i);
                    },
                    fail: function (res) {
                        wx.hideLoading()
                    }
                })
            } else {
                arr.push("/img/spell_head_holder.png")
                that.downHead(arr, ++i);
            }
        } else {
            yd.util.log(arr);
            if (that.data.qrCodeimage != null && that.data.goodimage_loc != null) {
                that.draw(that.data.goodimage_loc, that.data.qrCodeimage, arr);
            }
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            gid: options.gid
        });
        this.getSpellDel(this.data.gid);
        this.isVip(this);
        this.getqrCode(this.data.gid);
    },


    onRetry: function () {
        yd.util.commonToast("重新生成海报")
        this.getSpellDel(this.data.gid);
        this.isVip(this);
        this.getqrCode(this.data.sukId);

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

    },
})
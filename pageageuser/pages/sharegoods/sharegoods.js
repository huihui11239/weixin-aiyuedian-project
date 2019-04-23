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
        isTime:true
    },
    draw: function (goodimg, qrcode, delAllData) {
        const ctx = wx.createCanvasContext('shareCanvas');
        if (ctx.measureText) {
            yd.util.log("绘制")
            ctx.save(); // 先保存状态 已便于画完圆再用
            easyCanvas.drawRoundRect(ctx,"#FFF", 0, 0, 676, 952, 20);
            //绘制商品图
            easyCanvas.drawImage(ctx,goodimg, 0, 0, 675, 534);
            easyCanvas.drawImage(ctx,"../../../img/yudianlogo.png", 42, 0, 70, 86);
            //绘制二维码
            easyCanvas.drawImage(ctx,qrcode, 480, 630, 170, 170);
            easyCanvas.drawText(ctx,"长按识别前往购买",22,"#C5C5C5",478,826);

            if (delAllData.activityGoods!=null&& delAllData.activityGoods.type == 1) {
                //绘制限时限购
                easyCanvas.drawImage(ctx,'/img/t_bg_share.png', 0, 469, 676, 68);
                easyCanvas.drawImage(ctx,'/img/t_icon_share.png',30, 486,133, 43);
                let w1 = easyCanvas.drawText(ctx,'/',28,'#F8E71C',180,512,true);
                let w2 = easyCanvas.drawText(ctx,this.data.btime,28,'#FFFFFF',198+w1,512,true);
                w1=w1+w2+198;
                let w3=easyCanvas.drawText(ctx,'/',28,'#F8E71C',18+w1,512);
                w1=w1+w3+18;
                easyCanvas.drawText(ctx,this.data.start+'—'+this.data.end,24,'#FFFFFF',18+w1,510,true);
            }else if (delAllData.activityGoods!=null&& delAllData.activityGoods.type == 3) {
                //绘制拼团
                easyCanvas.drawImage(ctx,'/img/spell_share_bar.png', 0, 469, 676, 68);
                let w1 = easyCanvas.drawText(ctx,delAllData.activityGoods.peopleNum,36,'#FFE443',110,516,true);
                easyCanvas.drawText(ctx,"人团",24,'#FFFFFF',112+w1,516,true);
            }
            easyCanvas.drawRect(ctx,'#FAFAFA',0, 845, 676, 108);
            easyCanvas.drawLine(ctx,1.2,534,1.2,845,0.8,'#EDEDED');
            easyCanvas.drawLine(ctx,676-1.2,534,676-1.2,845,0.8,'#EDEDED');
            //绘制价格
            easyCanvas.drawText(ctx,"¥",36,'#FF5A5A',26,610,true);
            let pricestr=''
            if (delAllData.activityGoods!=null&& (delAllData.activityGoods.type == 1||delAllData.activityGoods.type == 3)){
                pricestr=delAllData.product_info.discountPrice
            } else {
                pricestr=delAllData.product_info.sellPrice
            }
            let priceWidth = easyCanvas.drawText(ctx,pricestr,60,'#FF5A5A',52,615,true);
            if ((delAllData.activityGoods!=null)||(delAllData.product_info.marketPrice != delAllData.product_info.sellPrice
                && delAllData.product_info.marketPrice != 0 && delAllData.product_info.marketPrice != null
                && delAllData.product_info.marketPrice != '' && delAllData.product_info.marketPrice != '0.00')) {
                let priceMMidth = easyCanvas.drawText(ctx,"¥" + delAllData.product_info.marketPrice,36,'#C5C5C5',priceWidth + 72,613,true);
                easyCanvas.drawLine(ctx,priceWidth + 72, 602,priceWidth + 72 + priceMMidth, 602,2,'#C5C5C5');
                let priceMWidth =easyCanvas.measureText(ctx,delAllData.product_info.marketPrice,36);
                //降价
                let priceSWidth = easyCanvas.measureText(ctx,"直降" + delAllData.product_info.saveMoney,24);
                easyCanvas.drawImage(ctx,"../../../img/save_bg2.png", priceWidth + priceMWidth + 170, 582, priceSWidth + 20, 35);
                easyCanvas.drawText(ctx,"直降" + delAllData.product_info.saveMoney,24,'#FF5A5A',priceWidth + priceMWidth + 180, 610,true);
                easyCanvas.drawImage(ctx,"../../../img/save_bg1.png", priceWidth + priceMWidth + 136, 580, 35, 38);
            }

            easyCanvas.drawLongText(ctx,delAllData.product_info.name,32,'#000000',26,680,38,400,2,true);
            ctx.restore();
            easyCanvas.drawText(ctx,delAllData.product_info.subName,28,'#808080', 26, 780,true);
            if (delAllData.product_info.showSellBaseCount!=null&&delAllData.product_info.showSellBaseCount>=100) {
                easyCanvas.drawText(ctx,delAllData.product_info.showSellBaseCount == null ? 0 + "人已购买" : delAllData.product_info.showSellBaseCount + "人已购买",20,'#B7A368',500, 905,true);
            }
            easyCanvas.drawText(ctx,"来自「" + this.data.name + "」的推荐",24,'#C5C5C5', 120,905,true);
            easyCanvas.drawRoundImage(ctx,this.data.headImage_loc,60,895,35);
            let that=this;
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
                    },2000);
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
            id: '海报生成-商品分享',
            label: '海报生成-商品分享',
            params: {
                from: wx.getStorageSync('userId')
            }
        });
    },
    /**
     * 保存分享图片到相册
     */
    saveShareCard: function (that) {
        easyCanvas.save2Memory(this,'shareCanvas').then(res=>{
            easyCanvas.save2PhotoAlbum(res);
            wx.showToast({
                title: '已保存到相册'
            })
        });
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

    checkSave:function(){
        let that=this;
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

    // 获取商品所有信息
    getAllData: function (id) {
        let pageState = pagestates(this)
        let that = this;
        let sukid = id;
        let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
        yd.util.log(yd.address);
        yd.util.log(yd.locaData);
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/goods/detailById/${sukid}/${siteId}`, 'app')
        }).then(res => {
            if (res.code === 0) {
                res.data.product_info.marketPrice = res.data.product_info.marketPrice;
                res.data.product_info.sellPrice = Number(res.data.product_info.sellPrice);
                console.log(res.data.product_info.marketPrice)
                console.log(res.data.product_info.sellPrice)
                if (res.data.activityGoods!=null&& (res.data.activityGoods.type == 1||res.data.activityGoods.type == 3)) {
                    res.data.product_info.saveMoney = res.data.product_info.marketPrice - res.data.product_info.discountPrice
                }else {
                    res.data.product_info.saveMoney = res.data.product_info.marketPrice - res.data.product_info.sellPrice
                }
                res.data.product_info.saveMoney=Math.round(res.data.product_info.saveMoney * 100) / 100;
                res.data.product_info.shareEarningsPrice = yd.util.getPriceDouble(res.data.product_info.shareEarningsPrice)
                res.data.product_info.selfEarningsPrice = yd.util.getPriceDouble(res.data.product_info.selfEarningsPrice)
                this.setData({
                    delAllData: res.data
                })
                if (res.data.activityGoods!=null&& res.data.activityGoods.type == 1){
                    let end='';
                    let btime=''
                    let btimelong=res.data.activityGoods.endDate/1000-res.data.activityGoods.startDate/1000
                    if (btimelong>=86400) {
                        end=yd.util.formatTime(res.data.activityGoods.endDate/1000, 'D日h:m')
                        btime='仅'+parseInt(btimelong/86400)+'天'
                    }else if (btimelong>3600) {
                        end=yd.util.formatTime(res.data.activityGoods.endDate/1000, 'h:m')
                        btime='仅'+parseInt(btimelong/3600)+'小时'
                    }else {
                        end=yd.util.formatTime(res.data.activityGoods.endDate/1000, 'h:m')
                        btime='仅'+parseInt(btimelong/60)+'分钟'
                    }
                    let start=yd.util.formatTime(res.data.activityGoods.startDate/1000, 'D日h:m');
                    this.setData({
                        start:start,
                        end:end,
                        btime:btime,
                        isTime:false
                    })
                }

                this.getgoodimg(res.data, id)
            } else {
                pageState.error()
                wx.hideLoading()
            }

        }).catch((error) => {
            // pageState.error()
            wx.hideLoading()
            console.log('error', error)
        })
    },

    // 获取二维码
    getqrCode: function (id) {
        let pageState = pagestates(this)
        let that = this;
        let goodsId = id;
        let userId = wx.getStorageSync('userId');
        yd.util.log("sharegoods qrcode:" + userId)
        yd.util.log(yd.address);
        yd.util.log(yd.locaData);
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/userInvite/getShareGoods/${userId}/${goodsId}`, 'app')
        }).then(res => {
            if (res.code === 0) {
                wx.downloadFile({
                    url: res.data,
                    success: function (res) {
                        that.setData({
                            qrCodeimage: res.tempFilePath
                        })
                        yd.util.log(res.tempFilePath)
                        if (that.data.qrCodeimage != null && that.data.goodimage_loc != null && that.data.headImage_loc != null) {
                            that.draw(that.data.goodimage_loc, that.data.qrCodeimage, that.data.delAllData);
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
            // pageState.error()
            wx.hideLoading()
            console.log('error', error)
        })
    },
    /**
     * 判断vip用户
     */
    isVip: function (that) {
        if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType")>1) {
            that.setData({
                vipBl: true
            })
        }
    },

    getHead: function (imagePath) {
        let pageState = pagestates(this)
        let that = this;
        wx.downloadFile({
            url: imagePath,
            success: function (res) {
                console.log(res.tempFilePath)
                that.setData({
                    headImage_loc: res.tempFilePath
                })
                if (that.data.qrCodeimage != null && that.data.goodimage_loc != null && that.data.headImage_loc != null) {
                    that.draw(that.data.goodimage_loc, that.data.qrCodeimage, that.data.delAllData);
                }
            },
            fail: function (res) {
                pageState.error()
                wx.hideLoading()
            }
        })
    },


    // 获取商品图片
    getgoodimg: function (goodsInfo, id) {
        let pageState = pagestates(this)
        console.log("转换图片")
        let that = this;
        wx.downloadFile({
            url: goodsInfo.product_deatilCarouselImg[0].detailValue,
            success: function (res) {
                that.setData({
                    goodimage_loc: res.tempFilePath
                })
                if (that.data.qrCodeimage != null && that.data.goodimage_loc != null && that.data.headImage_loc != null) {
                    that.draw(that.data.goodimage_loc, that.data.qrCodeimage, that.data.delAllData);
                }
            },
            fail: function (res) {
                pageState.error()
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            sukId: options.sukId,
            qrCodeimage: options.qrcode,
            headImage: options.img,
            parmar: options
        });
        let name=options.name.length>4?options.name.substr(0,4)+"...":options.name;
        this.setData({
            name:name
        });
        this.isVip(this);
        yd.util.log(this.data.sukId);
        this.getHead(options.img)
        this.getqrCode(this.data.sukId);
        this.getAllData(this.data.sukId);
    },


    onRetry: function () {
        yd.util.commonToast("重新生成海报")

        this.getHead(this.data.headImage)
        this.getAllData(this.data.sukId);
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
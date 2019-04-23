// pages/payresult/payresult.js
import {Provider} from '../../../utils/provider.js'
import pagestates from "../../../utils/pagestates/pagestates";

const yd = getApp().globalData
Page(Provider({

    /**
     * 页面的初始数据
     */
    data: {
        trues: 'ture',
        hasNextPage: true,
        vipBl: false,
        locaChane: false,
        call: '',
        apy: '',
        form: {},
        isGuideGoods:false,
        isGuideTeam:false,
        isGuideGoodsAdv:false,
        isGuideTeamAdv:false,
        shareBoxBl:true,
        isDrawSuccess: false,
        animationData: {},
        checked:false,
        isIphoneX:wx.getStorageSync('isIphoneX')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.isVip(this)
        options.orderId ? this.abc(options.orderId) : '';
        this.setData({
            orderId: options.orderId
        })
        this.falls();
        this.getJoinData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    abc: function (orderId) {
        let that = this;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/trade/findMyTradeDetail/${orderId}`, 'app')
        }).then(res => {
            console.log(res)
            if (res.code == 0) {
                if (res.data.trade.payCashFee) {
                    let payMoney = yd.util.getPriceDouble(res.data.trade.payCashFee)
                    that.setData({payMoney: payMoney})
                } else if (res.data.trade.totalPayMoney) {
                    let payMoney = yd.util.getPriceDouble(res.data.trade.totalPayMoney)
                    that.setData({payMoney: payMoney})
                }
            }
        }).catch((error) => {
            console.log('error', error)
        })
    },
    // 商品跳转
    detSkip: yd.util.notDoubleClick(function (e) {
        let comid = e.currentTarget.dataset.comid;

        wx.navigateTo({
            url: '../../pages/details/details?comid=' + comid + "&tag=支付成功页推荐列表",
        })
    }),
    // 返回首页
    gohome: yd.util.notDoubleClick(function (e) {
        wx.switchTab({
            url: '/pages/home/home'
        })
    }),
    //预期返现
    danxian: yd.util.notDoubleClick(function (e) {
        wx.navigateTo({
            url: '../../../packagepower/pages/earnings/earnings?type2=1&type3=today'
        })
    }),
    /**
     * 购买vip
     */
    vippay: yd.util.notDoubleClick(function (e) {
        wx.navigateTo({
            url: `../../../packagepower/pages/vippay/vippay`,
        })
    }),
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    /**
     * 判断vip用户
     */
    isVip: function (that) {
        if (wx.getStorageSync("levelType") !== null && wx.getStorageSync("levelType") > 1) {
            that.setData({vipBl: true})
        } else {
            if (wx.getStorageSync('token')) {
                yd.ajax({
                    method: 'POST',
                    url: yd.api.getUrl(`/user/index/myProfitInfo`, 'app'),
                    // url: 'http://172.16.1.73:11000/user/index/myProfitInfo',
                }).then(res => {
                    if (res.code == 0) {
                        this.setData({
                            form: res.data
                        })
                    }
                }).catch((error) => {
                    console.log('error', error)
                })
            }

        }
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
    // 瀑布流
    falls: function () {
        let that = this;
        if (that.data.hasNextPage) {
            // if(open="on"){

            // }else{}
            let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
            let pagesNum = (this.data.fallsList) ? (this.data.fallsList.length + 1) : 1;
            let pagesNumA = pagesNum - 1;
            let fallsList = (this.data.fallsList) ? this.data.fallsList : new Array();
            yd.ajax({
                method: 'POST',
                url: yd.api.getUrl(`/goods/selectionGoodsList`, 'app'),
                data: {
                    pageNum: pagesNum,
                    pageSize: 10,
                    param: siteId
                }
            }).then(res => {
                console.log(res)
                if (res.code === 0) {
                    //res.data.goods = yd.util.serverPriceDouble(res.data.goods)
                    fallsList[pagesNumA] = res.data.list;
                    let idindex = "comid" + pagesNumA;
                    that.setData({
                        fallsList: fallsList,
                        hasNextPage: res.data.hasNextPage,
                        idindex: idindex,
                    })
                } else {
                    // res.msg ? yd.util.commonToast(res.msg) : ''
                }
            }).catch((error) => {
            })
        } else {

        }
    },
    /**
     * 获取用户引导相关信息
     */
    getJoinData: function () {
        let that=this;
        let tradeCode = this.data.orderId;
        let buyUserId = wx.getStorageSync("userId");
        let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/userInvite/guideShare/${tradeCode}/${buyUserId}/${siteId}`, 'app'),
        }).then(res => {
            if (res.code == 0) {
                that.setData({
                    guideShare:res.data
                });
                if (that.data.guideShare.buyUserLevel==1){
                    //普通用户
                    if (that.data.guideShare.orderShareUserId!=null&&that.data.guideShare.orderShareUserId>0
                        &&that.data.guideShare.cpsUserLevel>=2&&(that.data.guideShare.buyUserParentId<=0||
                            that.data.guideShare.buyUserParentId==null)) {
                        that.setData({
                            isGuideTeamAdv:true
                        });
                        //判断7天内不显示
                        let timestamp = Date.parse(new Date());
                        timestamp = timestamp / 1000;
                        let logtamp=wx.getStorageSync("isShowTeam");
                        let btime=(timestamp-logtamp)>604800;
                        if (!logtamp||btime) {
                            that.setData({
                                isGuideTeam:true
                            })
                        }
                    }

                } else {
                    //vip
                    that.getAllData(that.data.guideShare.goodsId);
                    that.setData({
                        isGuideGoodsAdv:true
                    });
                    if (!wx.getStorageSync("isHideShare")) {
                        that.setData({
                            isGuideGoods:true
                        })
                    }
                }
            }
        }).catch((error) => {
            yd.util.log('error', error)
        })
    },

    closeGuideTeam:function(){
        this.setData({
            isGuideTeam:false
        });
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (this.data.checked){
            wx.setStorageSync("isShowTeam",timestamp)
        }
    },
    closeGuideGoods:function(){
        this.setData({
            isGuideGoods:false
        });
        if (this.data.checked){
            wx.setStorageSync("isHideShare",true)
        }
    },

    sareBox:function(){
        let that = this;
        getApp().jurisdiction(that, true).then(res => {
        }).catch((error) => {
            that.setData({
                isGuideGoods:false
            });
            getApp().tdsdk.event({
                id: '商品分享-VIP点击',
                label: '商品分享-VIP点击',
                params: {
                    form: wx.getStorageSync('userId')
                }
            });
            that.saveShareCard(that);
            that.showBox();
        })
    },

    checkboxChange:function(){
        this.data.checked=!this.data.checked;
    },

    showBox: function() {
        if (this.data.isDrawSuccess) {
            getApp().showPop(this, 'shareBoxBl', 200);
        } else {
            this.setData({
                isAutoSave: true
            })
            yd.util.loading("加载中", true);
        }
    },

    //取消分享
    boxCancel: function() {
        getApp().cancelPop(this, 'shareBoxBl', 200)
    },

    // 获取商品所有信息
    getAllData: function(id) {
        let that = this;
        let sukid = id;
        let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/goods/detailById/${sukid}/${siteId}`, 'app')
        }).then(res => {
            wx.hideLoading();
            console.log(res);
            if (res.code === 0) {
                that.getGoodImg(res.data);
                res.data.product_info.marketPrice = yd.util.getPriceDouble(res.data.product_info.marketPrice)
                res.data.product_info.sellPrice = Number(yd.util.getPriceDouble(res.data.product_info.sellPrice))
                res.data.product_info.saveMoney = yd.util.getPriceDouble(res.data.product_info.marketPrice - res.data.product_info.sellPrice)
                res.data.product_info.shareEarningsPrice = yd.util.getPriceDouble(res.data.product_info.shareEarningsPrice)
                res.data.product_info.selfEarningsPrice = yd.util.getPriceDouble(res.data.product_info.selfEarningsPrice)
                if (res.data.activityGoods != null) {
                    that.setData({
                        isTimeActivity: true
                    });
                    let btimelong = res.data.activityGoods.endDate / 1000 - res.data.activityGoods.startDate / 1000;
                    let btime = '';
                    if (btimelong > 86400) {
                        btime = '仅' + parseInt(btimelong / 86400) + '天'
                    } else if (btimelong > 3600) {
                        btime = '仅' + parseInt(btimelong / 3600) + '小时'
                    } else {
                        btime = '仅' + parseInt(btimelong / 60) + '分钟'
                    }
                    if (res.data.activityGoods.statusFlag == 1 && res.data.activityGoods.type == '1') {
                        let nprice = res.data.product_info.discountPrice;
                        res.data.product_info.sellPrice = nprice;
                    }
                    let startTime = yd.util.formatTime(res.data.activityGoods.startDate / 1000, 'M月D日 h:m');
                    that.setData({
                        btime: btime,
                        startTime: startTime,
                        statusFlag: res.data.activityGoods.statusFlag
                    });
                } else {
                    that.setData({
                        time: 0,
                        statusFlag: -1
                    });
                }
                that.setData({
                    delAllData: res.data
                });
            } else {
                that.setData({
                    delAllData: res.data,
                });
                res.msg ? yd.util.commonToast(res.msg) : ''
            }
        }).catch((error) => {
            wx.hideLoading();
            console.log('error', error)
        })
    },

    getGoodImg: function(delAllData) {
        let that = this;
        wx.downloadFile({
            url: delAllData.product_listImg.detailValue,
            success: function(res) {
                console.log(res.tempFilePath)
                that.draw(delAllData, res.tempFilePath)
            },
            fail: function(res) {
                wx.hideLoading();
            }
        })
    },

    draw: function(delAllData, bgpath) {
        const ctx = wx.createCanvasContext('shareCanvasMini');
        if (ctx.measureText) {
            yd.util.log("绘制")
            //绘制背景
            ctx.setFillStyle('#FAFAFA')
            ctx.fillRect(0, 0, yd.util.rpxTopx(840), yd.util.rpxTopx(680))
            //绘制商品
            ctx.save()
            this.roundRect(ctx, yd.util.rpxTopx(0), yd.util.rpxTopx(0), yd.util.rpxTopx(840), yd.util.rpxTopx(440), yd.util.rpxTopx(0));
            ctx.drawImage(bgpath, yd.util.rpxTopx(0), yd.util.rpxTopx(-160), yd.util.rpxTopx(840), yd.util.rpxTopx(672));
            ctx.restore()
            //绘制介绍文案
            ctx.save()
            if (this.data.isTimeActivity && delAllData.activityGoods.type == 1) {
                ctx.drawImage('/img/t_bg_message.png', yd.util.rpxTopx(0), yd.util.rpxTopx(436), yd.util.rpxTopx(840), yd.util.rpxTopx(96));
                ctx.drawImage('/img/t_icon_detail.png', yd.util.rpxTopx(32), yd.util.rpxTopx(460), yd.util.rpxTopx(186), yd.util.rpxTopx(60));
                ctx.setTextAlign('left');
                ctx.font = "normal bold 14px arial";
                ctx.setFillStyle('#F8E71C');
                ctx.setFontSize(yd.util.rpxTopx(40));
                let w1 = ctx.measureText('/').width;
                yd.util.log("宽度：" + w1 + "--" + "/")
                if (this.data.statusFlag != 3) {
                    ctx.fillText('/', yd.util.rpxTopx(250), yd.util.rpxTopx(500));
                    ctx.setFillStyle('#FFFFFF');
                    ctx.fillText(this.data.btime, yd.util.rpxTopx(280) + w1, yd.util.rpxTopx(500));
                }
            }else if (delAllData.activityGoods!=null && delAllData.activityGoods.type == 3){
                //绘制拼团
                ctx.drawImage('/img/spell_share_bar.png', yd.util.rpxTopx(0), yd.util.rpxTopx(436), yd.util.rpxTopx(840), yd.util.rpxTopx(96));
                ctx.setTextAlign('left');
                ctx.font = "normal bold 14px arial";
                ctx.setFillStyle('#FFE443');
                ctx.setFontSize(yd.util.rpxTopx(50));
                let w1=ctx.measureText(delAllData.activityGoods.peopleNum+"").width;
                ctx.fillText(delAllData.activityGoods.peopleNum, yd.util.rpxTopx(140), yd.util.rpxTopx(504));
                ctx.setFillStyle('#FFFFFF');
                ctx.setFontSize(yd.util.rpxTopx(36));
                ctx.fillText("人团", yd.util.rpxTopx(144)+w1, yd.util.rpxTopx(504));
            } else {
                ctx.font = "normal bold 14px arial";
                let name = delAllData.product_info.shortName;
                if (name.length > 16) {
                    name = name.substr(0, 15) + "..."
                }
                ctx.setFillStyle('#9B9B9B');
                ctx.setFontSize(yd.util.rpxTopx(48));
                ctx.fillText(name, yd.util.rpxTopx(32), yd.util.rpxTopx(528));
            }
            ctx.restore();
            //绘制抢购人数
            if (delAllData.product_info.showSellBaseCount >= 100 && this.data.statusFlag != 3) {
                ctx.setFillStyle('#FFF');
                ctx.setFontSize(yd.util.rpxTopx(40));
                let numw = ctx.measureText(delAllData.product_info.showSellBaseCount + '人已购买').width;
                if (this.data.isTimeActivity && (delAllData.activityGoods.type == 1||delAllData.activityGoods.type == 3)) {
                    ctx.fillText(delAllData.product_info.showSellBaseCount + '人已购买', yd.util.rpxTopx(812) - numw, yd.util.rpxTopx(500));
                } else {
                    ctx.fillText(delAllData.product_info.showSellBaseCount + '人已购买', yd.util.rpxTopx(812) - numw, yd.util.rpxTopx(412));
                }
            } else {
                ctx.font = "normal bold 14px arial";
                if (this.data.isTimeActivity && delAllData.activityGoods.type == 1 && this.data.statusFlag == 3) {
                    ctx.setFillStyle('#FFFFFF');
                    let date = this.data.startTime + " 开始";
                    let datew = ctx.measureText(date).width;
                    ctx.fillText(date, yd.util.rpxTopx(812) - datew, yd.util.rpxTopx(500));
                }
            }
            ctx.font = "normal bold 14px arial";
            //绘制价格
            //ctx.restore()
            ctx.setTextAlign('left');
            ctx.setFillStyle('#FF5A5A');
            ctx.setFontSize(yd.util.rpxTopx(56));
            ctx.fillText("¥", yd.util.rpxTopx(32), yd.util.rpxTopx(640));
            ctx.setFontSize(yd.util.rpxTopx(80));
            let priceWidth = 0;
            if (this.data.isTimeActivity && (delAllData.activityGoods.type == 1||delAllData.activityGoods.type == 3)) {
                priceWidth = ctx.measureText(delAllData.product_info.discountPrice + "").width;
                ctx.fillText(delAllData.product_info.discountPrice, yd.util.rpxTopx(68), yd.util.rpxTopx(645));
            } else {
                priceWidth = ctx.measureText(delAllData.product_info.sellPrice + "").width;
                ctx.fillText(delAllData.product_info.sellPrice, yd.util.rpxTopx(68), yd.util.rpxTopx(645));
            }

            if ((delAllData.activityGoods != null) || (delAllData.product_info.marketPrice != delAllData.product_info.sellPrice
                && delAllData.product_info.marketPrice != 0 && delAllData.product_info.marketPrice != null
                && delAllData.product_info.marketPrice != '' && delAllData.product_info.marketPrice != '0.00')) {
                ctx.setFillStyle('#808080');
                ctx.setFontSize(yd.util.rpxTopx(48));
                //ctx.setTextAlign('left');
                ctx.fillText("¥" + delAllData.product_info.marketPrice, priceWidth + yd.util.rpxTopx(88), yd.util.rpxTopx(640));
                let priceMMidth = ctx.measureText(delAllData.product_info.marketPrice + "").width;
                ctx.beginPath(); //开始一个新的路径
                ctx.setStrokeStyle('#808080');
                ctx.setLineWidth(yd.util.rpxTopx(2))
                ctx.moveTo(priceWidth + yd.util.rpxTopx(88), yd.util.rpxTopx(624)); //路径的起点
                ctx.lineTo(priceWidth + yd.util.rpxTopx(120) + priceMMidth, yd.util.rpxTopx(624)); //路径的终点
                ctx.stroke(); //对当前路径进行描边
                ctx.closePath(); //关闭当前路径
            }
            ctx.save()
            const grd = ctx.createLinearGradient(yd.util.rpxTopx(560), yd.util.rpxTopx(560), yd.util.rpxTopx(608), yd.util.rpxTopx(656));
            grd.addColorStop(0, '#FF6539')
            grd.addColorStop(1, '#FF3333')
            this.roundRect(ctx, yd.util.rpxTopx(560), yd.util.rpxTopx(560), yd.util.rpxTopx(248), yd.util.rpxTopx(96), yd.util.rpxTopx(18))
            ctx.setFillStyle(grd)
            ctx.fillRect(0, 0, yd.util.rpxTopx(840), yd.util.rpxTopx(680))
            ctx.restore();
            ctx.setTextAlign('center');
            ctx.font = "normal bold 14px arial";
            ctx.setFillStyle('#FFF');
            ctx.setFontSize(yd.util.rpxTopx(56));
            let btnText=(delAllData.activityGoods!=null && delAllData.activityGoods.type == 3)?"去开团":"去抢购";
            ctx.fillText(btnText, yd.util.rpxTopx(684), yd.util.rpxTopx(630));
            let that = this;
            ctx.draw(false,
                function(res) {
                    yd.util.log("绘制结束回调")
                    that.setData({
                        isDrawSuccess: true
                    });
                    that.saveShareCard(that);
                    wx.showShareMenu({
                        withShareTicket: true
                    });
                    if (that.data.isAutoSave) {
                        that.setData({
                            isAutoSave: false
                        });
                        wx.hideLoading();
                        that.showBox();
                    } else {
                        wx.hideLoading();
                    }
                }
            );

        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                showCancel: false,
                confirmText: '知道了',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                }
            })
            wx.hideLoading();
            wx.showShareMenu({
                withShareTicket: true
            });
        }
    },

    roundRect: function(ctx, x, y, w, h, r) {
        // 开始绘制
        ctx.beginPath();
        ctx.setFillStyle('#ffffff');
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);

        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.lineTo(x + w, y + r);

        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);

        ctx.lineTo(x + w, y + h - r);
        ctx.lineTo(x + w - r, y + h);

        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);

        ctx.lineTo(x + r, y + h);
        ctx.lineTo(x, y + h - r);

        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);

        ctx.lineTo(x, y + r);
        ctx.lineTo(x + r, y);

        ctx.setFillStyle('#fff');
        ctx.fill();

        ctx.clip();
        ctx.closePath();
    },
    /**
     * 保存分享图片到相册
     */
    saveShareCard: function(that, isTry = true) {
        if (this.data.isDrawSuccess) {
            const wxCanvasToTempFilePath = that.wxPromisify(wx.canvasToTempFilePath)
            wxCanvasToTempFilePath({
                canvasId: 'shareCanvasMini'
            }, this).then(res => {
                yd.util.log("图片保存成功");
                that.setData({
                    sharePath: res.tempFilePath
                })

                yd.util.log("分享：" + res.tempFilePath)
            }).catch(res => {
                if (isTry) {
                    //绘制失败重试机制
                    that.saveShareCard(that, false);
                }
                yd.util.log("分享：保存失败")
                console.log(res)
            })
        }
    },
    /**
     * wxPromisify
     * @fn 传入的函数，如wx.request、wx.download
     */
    wxPromisify: function(fn) {
        return function(obj = {
            quality: 1
        }) {
            return new Promise((resolve, reject) => {
                obj.success = function(res) {
                    resolve(res)
                }

                obj.fail = function(res) {
                    reject(res)
                }

                fn(obj) //执行函数，obj为传入函数的参数
            })
        }
    },

    //朋友圈
    sendCircle: function() {
        getApp().tdsdk.event({
            id: '商品分享-朋友圈',
            label: '商品分享-朋友圈',
            params: {
                form: wx.getStorageSync('userId')
            }
        });
        this.boxCancel();
        let userData=wx.getStorageSync("userinfo")
        wx.navigateTo({
            url: `/pageageuser/pages/sharegoods/sharegoods?sukId=${this.data.guideShare.goodsId}&qrcode=&name=${userData.nickName}&img=${userData.avatarUrl}`,
        });
    },


    /**
     * 加入团队
     */
    joinTeam:function(){
        wx.navigateTo({
            url: '/pageageuser/pages/jointeam/jointeam?inviteCode=' + this.data.guideShare.cpsuser.inviteCode
        })
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
        this.falls();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        this.boxCancel();
        let that = this;
        let userId = wx.getStorageSync('userId');
        let shareimg = that.data.sharePath ? that.data.sharePath : ""
        if (shareimg == "") {
            that.saveShareCard(that)
        }
        getApp().tdsdk.event({
            id: '商品分享-群会话',
            label: '商品分享-群会话',
            params: {
                from: wx.getStorageSync('userId'),
                canvas_state: shareimg == "" ? "失败" : "成功"
            }
        });
        getApp().tdsdk.share({
            title: `${this.data.delAllData.product_info.name}`,
            path: `packagebuy/pages/details/details?comid=${that.data.delAllData.product_info.id}&userCode=${userId}`
        });
        return {
            title: `${this.data.delAllData.product_info.name}`,
            imageUrl: shareimg,
            path: `packagebuy/pages/details/details?comid=${that.data.delAllData.product_info.id}&userCode=${userId}`
        }
    },
    nullEvent:function () {

    }
})({
    onPageScroll: true,
    onShow: true
}))
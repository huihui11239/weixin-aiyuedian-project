// packagepower/pages/limittime/limittime.js
import pagestates from "../../../utils/pagestates/pagestates";

const yd = getApp().globalData;
const easyCanvas = require('../../../easyCanvas/easyCanvas.js');
import {
    Provider
} from '../../../utils/provider.js'

Page(Provider({
    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: wx.getStorageSync('isIphoneX'),
        shopboxBl: true,
        shareBoxBl: true,
        comNum: 1,
        time: 0,
        allUserBl: false,
        loginBl: false,
        articleBL: false,
        spellBackBl: false,
        colonelBl: false,
        isGuideTeam: false,
        checked: false
    },
    // 获得拼团信息
    getSpellDel: function (gid, pullBl = false) {
        let that = this;
        yd.util.loading();
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/group/detail/${gid}`, 'app')
        }).then(res => {
            if (res.code === 0) {
                if (res.data.goodsDetaillist.length) {
                    let comVirtue = new Array;
                    let article;
                    let comCpe = new Array;
                    let youKnow = new Array;
                    for (let i = 0; i < res.data.goodsDetaillist.length; i++) {
                        console.log(res.data.goodsDetaillist[i].detailType)
                        switch (res.data.goodsDetaillist[i].detailType) {
                            case 'product_merit':
                                comVirtue.push(res.data.goodsDetaillist[i])
                                break;
                            case 'deatilDescImg':
                                article = res.data.goodsDetaillist[i].detailValue;
                                break;
                            case 'specifications':
                                comCpe.push(res.data.goodsDetaillist[i])
                                break;
                            case 'storageMethod':
                                comCpe.push(res.data.goodsDetaillist[i])
                                break;
                            case 'expirationDate':
                                comCpe.push(res.data.goodsDetaillist[i])
                                break;
                            case 'madeArea':
                                comCpe.push(res.data.goodsDetaillist[i])
                                break;
                            case 'brandName':
                                comCpe.push(res.data.goodsDetaillist[i])
                                break;
                            case 'product_you_know':
                                youKnow.push(res.data.goodsDetaillist[i])
                                break;
                        }
                    }
                    console.log(article);
                    that.setData({
                        comCpe: comCpe,
                        comVirtue: comVirtue,
                        youKnow: youKnow
                    })
                    if (!that.data.articleBL) {
                        try {
                            yd.WxParse.wxParse('article', 'html', article, that, 12);
                        } catch (err) {
                            yd.util.commonToast(err)
                        }
                        that.setData({
                            articleBL: true
                        })
                    }

                }
                if (!res.data.groupOrder) {
                    res.data.groupOrder = {
                        payStatus: 0
                    };
                }
                if (res.data.endDate - res.data.now < 0) {
                    this.setData({
                        timeEnd: true
                    })
                }
                let groupUser = new Array(res.data.group.partakeNumMax)
                if (res.data.groupOrderList.length) {
                    for (let i = 0; i < res.data.groupOrderList.length; i++) {
                        groupUser[i] = res.data.groupOrderList[i];
                    }
                }
                that.setData({
                    delData: res.data,
                    groupUser: groupUser
                })
                if (res.data.identity == 1 && !res.data.buyUserParentId && res.data.inviteCode && (res.data.group.groupStatus == 12 || res.data.group.groupStatus == 50 || res.data.group.groupStatus == 51 || res.data.group.groupStatus == 52) && res.data.group.headerLevelId > 1) {
                    console.log(0)
                    that.setData({
                        joinTeamShow: true
                    });
                    let timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    let logtamp = wx.getStorageSync("spellShowTeam");
                    let btime = (timestamp - logtamp) > 604800;
                    if (!logtamp || btime) {
                        that.setData({
                            isGuideTeam: true
                        })
                    }

                }
                if (res.data.group.groupStatus == 10) {
                    let time = res.data.group.expiresTime / 1000 - res.data.now / 1000;
                    that.spellTime(Math.ceil(time));
                    that.getGoodImg();
                    that.getHeadList();
                }
                wx.hideLoading();
                pullBl ? wx.stopPullDownRefresh() : '';
            } else {
                wx.hideLoading();
                pullBl ? wx.stopPullDownRefresh() : '';
                res.msg ? yd.util.commonToast(res.msg) : '';
            }
        }).catch((error) => {
            wx.hideLoading();
            pullBl ? wx.stopPullDownRefresh() : '';
        })
    },
    // 关闭
    closeGuideTeam: function () {
        this.setData({
            isGuideTeam: false
        });
        if (this.data.checked) {
            let timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            wx.setStorageSync("spellShowTeam", timestamp)
        }
    },

    // 选择七天内不在加入
    checkboxChange: function () {
        this.data.checked = !this.data.checked;
    },
    // 跳转加入团队
    joinTeam: function () {
        wx.navigateTo({
            url: '/pageageuser/pages/jointeam/jointeam?inviteCode=' + this.data.delData.inviteCode
        })
    },
    /**
     *
     * 拼团倒计时
     */
    spellTime(time) {
        //time=86400*2
        let that = this
        time = time + ''
        let time1 = time
        if (time1 < 0) {
            return
        }
        if (that.data.timeIndex) {
            clearInterval(that.data.timeIndex)
        }
        that.setData({
            showTime: true
        });
        let second = 0
        that.setData({
            timeIndex: setInterval(function () {
                time1 = time1 - 1
                if (time1 > 0) {
                    let day = parseInt(time1 / 86400)
                    that.setData({
                        day: day
                    });
                    let hour = parseInt((time1 - day * 86400) / 3600)
                    if (hour < 10) {
                        hour = '0' + hour
                    }
                    that.setData({
                        hour: hour
                    });
                    let minute = parseInt((time1 - day * 86400 - hour * 3600) / 60)
                    if (minute < 10) {
                        minute = '0' + minute
                    }
                    second = time1 - day * 86400 - hour * 3600 - minute * 60
                    that.setData({
                        minute: minute
                    });
                    if (second < 10) {
                        second = '0' + second
                    }
                    that.setData({
                        second: second
                    });
                    //yd.util.log(day+"--"+hour+"--"+minute+"--"+second)
                } else {
                    that.getSpellDel(that.data.delData.group.id)
                    clearInterval(that.data.timeIndex)
                }
                that.setData({
                    time: time1
                })
            }, 1000)
        });
    },
    myspelllist: function () {
        wx.redirectTo({
            url: '/pageageuser/pages/myspelllist/myspelllist'
        })
    },
    // 再次支付
    payAgin: function () {
        let that = this;
        wx.showModal({
            title: '支付',
            content: '您已是团员，请您继续支付',
            confirmText: '支付',
            success: function (res) {
                if (res.confirm) {
                    that.payClick(that.data.delData.groupOrder.id);
                } else {
                    wx.redirectTo({
                        url: '/pageageuser/pages/myspelllist/myspelllist'
                    })
                }
            },
            fail: function (res) {
                wx.redirectTo({
                    url: '/pageageuser/pages/myspelllist/myspelllist'
                })
            }
        })
    },
    payClick: function (goid) {
        let that = this;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/group/rePayGroupOrder/${goid}`, 'app')
        }).then(res => {
            console.log(res);
            // that.setData();
            let payData = res.data.payMap;
            wx.requestPayment({
                'timeStamp': payData.timeStamp,
                'nonceStr': payData.nonceStr,
                'package': payData.package,
                'signType': payData.signType,
                'paySign': payData.paySign,
                success: function (res) {
                    wx.showLoading({
                        title: "支付成功",
                    });
                    setTimeout(function () {
                        wx.hideLoading();
                        that.getSpellDel(that.data.delData.group.id);
                    }, 2000);
                },
                fail: function (res) {
                    that.unLockPaySpell(goid);
                }
            })
        }).catch((error) => {
            console.log('error', error)
        })
    },
    // 取支付
    unLockPaySpell(id) {
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/group/unLockPayGroupOrder/${id}`, 'app')
        }).then(res => {
        }).catch((error) => {
            console.log("error", error)
        })
    },
    // 查看全部人员
    watchUser: function () {
        this.setData({
            allUserBl: !this.data.allUserBl
        })
    },
    // 去订单
    goOrder: function (e) {
        wx.navigateTo({
            url: `/pageageuser/pages/orderdetails/orderdetails?id=${e.currentTarget.dataset.trandid}`,
        })
    },
    // 去首页
    goHome: function () {
        wx.switchTab({
            url: '/pages/home/home',
        })
    },
    spellNew: function () {
        wx.reLaunch({
            url: '/packagebuy/pages/spelllist/spelllist',
        })
    },
    // 去拼团说明
    spellState: function () {
        wx.navigateTo({
            url: '/packagebuy/pages/spellstate/spellstate',
        })
    },

    // 打开分享盒子
    shareOpen: function () {
        let that = this
        getApp().jurisdiction(that).then(res => {
            console.log(123)
        }).catch((error) => {
            yd.util.log("VIP分享")
            getApp().tdsdk.event({
                id: '拼团分享-点击',
                label: '拼团分享-点击',
                params: {
                    form: wx.getStorageSync('userId')
                }
            });
            this.saveShareCard(this);
            if (this.data.isDrawSuccess) {
                getApp().showPop(this, 'shareBoxBl', 200);
            } else {
                this.setData({
                    isAutoSave: true
                })
                yd.util.loading("加载中", true);
            }
        })
    },
    // 减少数量
    comNumJ: function () {
        let comNum = this.data.comNum;
        if (comNum > 1) {
            comNum--
        } else {
            yd.util.commonToast("商品数量不能小于1")
        }
        this.setData({
            comNum: comNum
        })
    },
    // 增加数量
    comNumA: function () {
        let comNum = this.data.comNum;
        if ((comNum + 1) > this.data.spellNumber) {
            yd.util.commonToast("您已到购买上限")
        } else {
            comNum++
        }
        this.setData({
            comNum: comNum
        })
    },
    // 关闭分享朋友圈
    shareChose: function () {
        getApp().cancelPop(this, 'shareBoxBl', 200);
    },
    //朋友圈
    sendCircle: function () {
        let userData = wx.getStorageSync('userinfo')
        //yd.userInformation = this.data.user //只有分享页面可用
        this.shareChose();
        wx.navigateTo({
            url: '/packagebuy/pages/sharespell/sharespell?gid=' + this.data.delData.group.id,
        })
    },
    // 受邀人参团
    spellJoin: function () {
        let that = this;
        getApp().jurisdiction(that).then(res => {

        }).catch((error) => {
            getApp().checkPhone(that).then(res => {
                that.openNumBox();
                that.getSpellNumber()
            }).catch((error) => {
                console.log('error', error)
            })
        })
    },
    getBack: function () {
        let that = this;
        getApp().checkPhone(that).then(res => {
            that.openNumBox();
            that.getSpellNumber()
        }).catch((error) => {
            console.log('error', error)
        })
    },
    // 获取能买的数量
    getSpellNumber: function () {
        let that = this
        let data = this.data.delData.group
        yd.util.loading("加载中...");
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/group/startBuyCheck`, 'app'),
            data: {
                activityId: data.activityId,
                buyNum: 1,
                productId: data.productId,
                siteId: yd.locaData.siteId,
                type: 1,
                groupId: data.id
                // siteId: that.data.addressCode
            }
        }).then(res => {
            wx.hideLoading();
            if (res.code === 0) {
                that.setData({
                    spellNumber: res.data.buyNum + res.data.remianNum,
                    moverBuyNum: res.data.remianNum,
                    spellBackBl: true
                })
            } else {
                that.setData({
                    spellNumber: 0,
                    comNum: 0
                })
                switch (res.code) {
                    case 29001:
                        yd.util.commonToast('活动不存在')
                        break
                    case 29002:
                        yd.util.commonToast('活动商品不存在')
                        break
                    case 29999:
                        yd.util.commonToast('操作失败')
                        break
                    case 29010:
                        yd.util.commonToast('已达商品购买数量上限')
                        break
                    case 29012:
                        yd.util.commonToast('已达最大开团数量限制')
                        break
                    case 29007:
                        wx.showModal({
                            title: '提示',
                            content: '您本商品开团数量已达上限，去看看其他拼团商品吧',
                            confirmText: '知道了',
                            showCancel: false,
                            success: function (res) {
                                wx.reLaunch({
                                    url: '/packagebuy/pages/spelllist/spelllist'
                                })
                            },
                            fail: function (res) {
                                yd.util.commonToast('您本商品开团数量已达上限，去看看其他拼团商品吧')
                            }
                        })
                        break
                    case 29021:
                        yd.util.commonToast('该团已满员')
                        break
                    case 29020:
                        wx.showModal({
                            title: '提示',
                            content: '只有新用户才能参团，去开团吧！',
                            confirmText: '去开团',
                            showCancel: false,
                            success: function (res) {
                                wx.reLaunch({
                                    url: '/packagebuy/pages/spelllist/spelllist'
                                })
                            },
                            fail: function (res) {
                                yd.util.commonToast('只有新用户才能参团，去开团吧')
                            }
                        })
                        break
                    case 29022:
                        yd.util.commonToast('您已加入该团')
                        break
                }
            }
        }).catch((error) => {
            wx.hideLoading();
            console.log('error', error)
            pageState.error()
        })
    },

    // 打开选择数量盒子
    openNumBox: function () {
        let that = this;
        getApp().showPop(that, 'shopboxBl', 304);
    },
    // 关闭选择数量盒子
    choseNumBox: function () {
        let that = this;
        getApp().cancelPop(this, 'shopboxBl', 304);
        that.setData({
            spellBackBl: false
        });
    },

    //拼团确认
    spellJionEnter: function () {
        let that = this;
        let spellData = {
            comNum: that.data.comNum,
            comImg: that.data.delData.group.productImg,
            comName: that.data.delData.group.productName,
            comId: that.data.delData.group.productId,
            comSku: that.data.delData.group.specification,
            comPrice: that.data.delData.group.activityPrice,
            activityId: that.data.delData.group.activityId,
            groupId: that.data.delData.group.id,
            activityGoodsId: that.data.delData.group.activityGoodsId,
            cpsUserId: that.data.userCode ? that.data.userCode : 0
        };
        spellData = JSON.stringify(spellData)
        wx.navigateTo({
            url: `/packagebuy/pages/indent/indent?orderdata=${spellData}`,
        });
    },
    // 复制单号
    copy(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.id,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'none',
                    duration: 1500
                })
            }
        });
    },

    getGoodImg: function () {
        let that = this;
        let imagePath = that.data.delData.listImg
        wx.downloadFile({
            url: imagePath,
            success: function (res) {
                console.log(res.tempFilePath)
                that.setData({
                    goodImg: res.tempFilePath
                })
                if (that.data.headList.length >= that.data.delData.group.partakeNumMax) {
                    that.draw(res.tempFilePath)
                }
            },
            fail: function (res) {
                wx.hideLoading();
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
        let headListData = that.data.delData.groupOrderList;
        if (i < headListData.length) {
            if (that.data.delData.groupOrderList[i].userImg) {
                wx.downloadFile({
                    url: headListData[i].userImg,
                    success: function (res) {
                        arr.push(res.tempFilePath)
                        that.downHead(arr, ++i);
                    },
                    fail: function (res) {
                        wx.hideLoading();
                    }
                })
            } else {
                arr.push("/img/spell_head_holder.png")
                that.downHead(arr, ++i);
            }
        } else {
            yd.util.log(arr);
            for (let j = 0; j < that.data.delData.group.partakeNumMax - that.data.delData.group.partakeNum; j++) {
                arr.push("/img/spell_head_holder.png")
            }
            if (that.data.goodImg) {
                that.draw(that.data.goodImg);
            }
        }
    },

    draw: function (bgpath) {
        const ctx = wx.createCanvasContext('shareCanvasMini');
        if (ctx.measureText) {
            let spellData = this.data.delData
            yd.util.log("绘制")
            //绘制背景
            easyCanvas.drawRect(ctx,"#FFF",0, 0, 840, 680);
            //绘制商品
            ctx.save();
            easyCanvas.drawRoundRect(ctx,"#FFF",0, 0, 840, 440, 0);
            easyCanvas.drawImage(ctx,bgpath,0, -160, 840, 672);
            ctx.restore();
            //绘制介绍文案
            ctx.save();
            easyCanvas.drawImage(ctx,'/img/spell_share_bar.png', 0, 392, 840, 96);
            easyCanvas.drawText(ctx,"【仅剩" + (spellData.group.partakeNumMax - spellData.group.partakeNum) + "个名额】",40,'#FFFFFF',120,456,true);
            if (spellData.showSellBaseCount >= 100) {
                let numw=easyCanvas.measureText(ctx,spellData.showSellBaseCount + '人已购买',40);
                easyCanvas.drawText(ctx,spellData.showSellBaseCount + '人已购买',808-numw,456);
            }
            //绘制团员头像
            let arr = this.data.headList;
            for (let i = 0; i < arr.length; i++) {
                if (i < 5) {
                    let left = i * 168 + 22;
                    ctx.restore();
                    ctx.save();
                    if (arr[i] != "/img/spell_head_holder.png") {
                        const grdHead =easyCanvas.createLinearGradient(ctx,left - 4, 580, 124, 0,'#FF8B54','#FF4848');
                        easyCanvas.drawRoundRect(ctx,grdHead,left - 4, 518, 124, 124, 62);
                        ctx.restore();
                    }
                    ctx.save();
                    easyCanvas.drawRoundRect(ctx,"#FFF",left - 2, 520, 120, 120, 60);
                    easyCanvas.drawImage(ctx,arr[i], left - 2,520, 120, 120);
                    ctx.restore();
                    if (i === 0) {
                        ctx.save();
                        const grd =easyCanvas.createLinearGradient(ctx,44, 638, 74, 0,'#FF8B54','#FF4848');
                        easyCanvas.drawRoundRect(ctx,grd,44, 618, 74, 34, 16);
                        ctx.restore();
                        easyCanvas.drawText(ctx,"团长",20,"#FFF",62, 641);
                    }
                }
            }

            let that = this;
            ctx.draw(false,
                function (res) {
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
                        that.shareOpen();
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
                success: function (res) {
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

    /**
     * 保存分享图片到相册
     */
    saveShareCard: function (that, isTry = true) {
        if (this.data.isDrawSuccess) {
            easyCanvas.save2Memory(this,"shareCanvasMini").then(res=>{
                yd.util.log("图片保存成功");
                that.setData({
                    sharePath: res
                });
            })
        }
    },
    /**
     * 后台点击统计
     */
    getFormId(label, msgId) {
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/push/clickCount/${msgId}/${label}`, 'app'),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        // 判断地址来源
        let that = this;
        // 解析二维码携带参数
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            console.log(scene)
            var parmer = scene.split("&");
            for (var i = 0; i < parmer.length; i++) {
                var info = parmer[i].split("=");
                switch (info[0]) {
                    case "userId":
                        break;
                    case "gid":
                        that.setData({
                            loginBl: true,
                            gid: info[1]
                        })
                        break;
                }
            }
        } else {
            options.userId ? that.setData({
                loginBl: true,
                gid: options.gid
            }) : that.setData({
                gid: options.gid
            })
        }
        if (options.label && options.msgId) {
            this.getFormId(options.label, options.msgId)
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
        let that = this;
        if (that.data.loginBl) {
            getApp().login().then(res => {
                that.getSpellDel(that.data.gid);
                that.setData({
                    loginBl: false
                })
            }).catch((error) => {
                that.getSpellDel(that.data.gid);
                that.setData({
                    loginBl: false
                })
            })
        } else {
            that.getSpellDel(that.data.gid);
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getSpellDel(this.data.gid, true);
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
        let userId = wx.getStorageSync('userId')
        this.shareChose();
        getApp().tdsdk.share({
            title: `快来${this.data.delData.group.activityPrice}元拼${this.data.delData.group.productName}`,
            path: `packagebuy/pages/spelldel/spelldel?gid=${this.data.delData.group.id}&userId=${userId}`
        });
        return {
            title: `快来${this.data.delData.group.activityPrice}元拼${this.data.delData.group.productName}`,
            imageUrl: this.data.sharePath,
            path: `packagebuy/pages/spelldel/spelldel?gid=${this.data.delData.group.id}&userId=${userId}`
        }
    },
})({
    onPageScroll: true,
    onShow: true
}))
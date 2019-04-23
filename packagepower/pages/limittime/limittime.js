// packagepower/pages/limittime/limittime.js
import pagestates from "../../../utils/pagestates/pagestates";

const yd = getApp().globalData;
const easyCanvas = require('../../../easyCanvas/easyCanvas.js');
import {Provider} from '../../../utils/provider.js'

Page(Provider({
    /**
     * 页面的初始数据
     */
    data: {
        sessionIndex: null,
        vipBl: false,
        sessionList: [],
        sessionWith: 150,
        bookItem: null,
        isLoad: true,
        isFirstChoose:true,
        activityId:'',
        shareBoxBl:true,
        isIphoneX: wx.getStorageSync('isIphoneX'),
        distance:0,
        isDraw:true
    },
    /**
     * 获取限时限购商品列表
     * */
    limitTime: function (isReset=true) {
        if (isReset){
            this.setData({
                limitData: []
            });
        }
        let that = this;
        let pageState = pagestates(this);
        let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;
        yd.ajax({
            method: 'GET',
            url: yd.api.getUrl(`/activityGoods/getActivityList/${that.data.sessionList[that.data.sessionIndex].id}/${siteId}`, 'app')
        }).then(res => {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
            yd.util.log(res);
            if (res.code === 0) {
                that.setData({
                    limitData: res.data.lists,
                    cheap:res.data.cheap,
                    obtain:res.data.obtain
                });
                //初始化分享数据(列表重置后制作图片)
                if (isReset) {
                    that.initShareData();
                }
            } else {
                res.msg ? yd.util.commonToast(res.msg) : ''
            }
            that.setData({isLoad: false});
        }).catch((error) => {
            that.setData({isLoad: false});
            console.log('error', error);
            pageState.error()
        })
    },
    /**
     * 限时限购倒计时器
     */
    limitTimeCount() {
        let browTime = 0;
        let that = this;
        if (that.data.timeIndex) {
            clearInterval(that.data.timeIndex);
        }
        //初始化时间戳
        that.initLimitTime(browTime);
        //启动计时器
        that.setData({
            timeIndex: setInterval(function () {
                browTime = browTime + 1;
                that.initLimitTime(browTime);
            }, 1000)
        });
    },
    /**
     * 倒计时时间戳转化
     * */
    initLimitTime(browTime) {
        let that = this;
        let list = [];
        let sessionList = that.data.sessionList;
        for (let i = 0; i < sessionList.length; i++) {
            let time1 = sessionList[i].surplusDate - browTime;
            if (time1 > 0) {
                let day = parseInt(time1 / 86400);
                let hour = parseInt((time1 - day * 86400) / 3600);
                if (hour < 10) {
                    hour = '0' + hour
                }
                let minute = parseInt((time1 - day * 86400 - hour * 3600) / 60);
                if (minute < 10) {
                    minute = '0' + minute
                }
                let second = parseInt((time1 - day * 86400 - hour * 3600 - minute * 60));
                if (second < 10) {
                    second = '0' + second
                }
                // let msecond = time1 - day * 864000 - hour * 36000 - minute * 600 - second * 10;
                // if (msecond < 10) {
                //     msecond = '0' + msecond
                // }
                let timeObj = {
                    day: day,
                    hour: hour,
                    minute: minute,
                    second: second,
                    // msecond: msecond,
                    remainTime: time1
                };
                list.push(timeObj)
            } else {
                that.initLimitMenu();
                return
            }
        }
        that.setData({
            timelist: list
        })
    },
    remove: function (a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                a.splice(i, 1)
            }
        }
    },
    /**
     * 初始化计时器
     * */
    initLimitMenu: function () {
        let that = this;
        if (that.data.timeIndex) {
            clearInterval(that.data.timeIndex)
        }
        that.getActivityList();
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
    /**
     * 商品跳转
     */
    detSkip: yd.util.notDoubleClick(function (e) {
        let comid = e.currentTarget.dataset.comid;
        let tag = e.currentTarget.dataset.tag;
        wx.navigateTo({
            url: '/packagebuy/pages/details/details?comid=' + comid + "&tag=" + tag,
            complete: function (res) {
            },
        })
    }),
    /**
     * vip跳转
     */
    vipSkip: function () {
        wx.switchTab({
            url: "/pages/vip/vip"
        })
    },
    /**
     * 场次点击事件
     */
    clickTitle: yd.util.notDoubleClick(function (e) {
        let that=this;
        let index = e.currentTarget.dataset.item;
        if (index!=that.data.sessionIndex) {
            that.setData({
                sessionIndex: index,
                limitData: [],
                isLoad: true,
                timelist: null,
                cheap:"--",
                obtain:"--"
            });
            that.setData({
                distance:that.data.sessionWith*that.data.sessionIndex+(that.data.sessionWith-120)/2.0
            });
            that.initLimitMenu();
        }
    }),
    /**
     * 订阅消息
     */
    bookMessage: function (e) {
        let item = e.currentTarget.dataset.item;
        this.setData({bookItem: item});
        yd.util.log(item);
        let that=this;
      getApp().jurisdiction(this).then(res => {
         
        }).catch(res=>{
          if (!item.isSub) {
            yd.util.log("已经有授权");
            that.bookGoods(item.activityId, item.goodsId);
          } else {
            yd.util.commonToast("已设置提醒");
          }
        })
    },

   

    /**
     * 未授权点击订阅，授权后自动订阅
     * */
    autoBook: function () {
        let item = this.data.bookItem;
        if (item != null) {
            yd.util.log("授权后订阅:" + wx.getStorageSync('token') + "----" + item.name);
            this.bookGoods(item.activityId, item.goodsId);
        }
    },

    /**
     * 订阅商品
     * */
    bookGoods: function (activityId, goodsId) {
        let that=this;
        yd.ajax({
            method: 'POST',
            url: yd.api.getUrl(`/subscribe/${activityId}/${goodsId}`, 'app'),
        }).then(res => {
            if (res.code === 0) {
                yd.util.commonToast("将在开场前5分钟提示您！");
                that.limitTime(false);
            } else {
                res.msg ? yd.util.commonToast(res.msg) : '';
            }
        })
    },
    /**
     * 获取场次菜单
     * */
    getActivityList:function(){
        let that=this;
        let siteId = (yd.locaData.siteId) ? yd.locaData.siteId : 1;

        if (that.data.sessionIndex!=null){
            that.data.activityId=that.data.sessionList[that.data.sessionIndex].id;
        }
        yd.ajax({
            method: 'GET',
            url: yd.api.getUrl(`/activity/getActivityList/1/${siteId}`, 'app'),
        }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    let sessionList = new Array();
                    if (res.data.haveInHand != null && res.data.haveInHand.length != 0) {
                        sessionList = sessionList.concat(res.data.haveInHand);
                    }
                    if (res.data.soonBegin != null && res.data.soonBegin.length != 0) {
                        sessionList = sessionList.concat(res.data.soonBegin);
                    }
                    let selectIndex = "";
                    let locationId = "";
                    for (let i = 0; i < sessionList.length; i++) {
                        if (sessionList[i].isLocation) {
                            locationId = i;
                        }
                        if (sessionList[i].id == that.data.activityId) {
                            selectIndex = i;
                        }
                        sessionList[i].startDate = yd.util.formatTime(sessionList[i].startDate / 1000, "M月D日h:m")
                    }
                    that.setData({
                        sessionList: sessionList
                    });
                    //初始化选中项
                    if (that.data.sessionIndex==null) {
                        if (selectIndex === "") {
                            that.setData({
                                sessionIndex: locationId
                            })
                        } else {
                            that.setData({
                                sessionIndex: selectIndex
                            })
                        }
                    }
                    that.limitTimeCount();
                    //初始化商品菜单
                    that.limitTime();
                    //计算场次菜单宽度
                    if (that.data.sessionList.length < 5) {
                        that.setData({
                            sessionWith: 750 / that.data.sessionList.length
                        })
                    } else {
                        that.setData({
                            sessionWith: 150
                        })
                    }
                    that.setData({
                        distance:that.data.sessionWith*that.data.sessionIndex+(that.data.sessionWith-120)/2.0,
                    });
                    // yd.util.log(that.data.distance)
                }else {
                    that.setData({
                        isLoad: false,
                        sessionList: [],
                        limitData:[],
                        sessionIndex:null
                    })
                }
            } else {
                res.msg ? yd.util.commonToast(res.msg) : '';
            }
        })
    },

    /**
     * 弹出分享弹窗
     * */
    sharePop: function () {
        this.setData({
            shareBoxBl: false
        })
    },

    /**
     * 关闭分享弹窗
     * */
    boxCancel: function () {
        this.setData({
            shareBoxBl: true
        })
    },

    onRetry: function () {
        this.initLimitMenu();
        let pageState = pagestates(this);
        pageState.finish()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 2018-9-4 jinjinjin 获取点击数量
        //this.getActivityList();
        if (options.label && options.msgId) {
            getApp().statisticsClick(options.label, options.msgId)
        }
        if (options.activityId) {
            this.setData({
                activityId:options.activityId
            })
        }
        //后台cps调用
        if (options.userCode&&options.userCode!=""){
            wx.setStorageSync("shareUser",options.userCode);
            getApp().goodCPS()
        }
        this.initLimitMenu();
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
        this.isVip(this);
        if (this.data.sessionIndex||this.data.sessionIndex===0){
            this.limitTime(false);
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
        if (this.data.timeIndex) {
            clearInterval(this.data.timeIndex);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();//在标题栏中显示加载
        this.setData({
            isLoad:true
        })
        this.initLimitMenu();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 初始化分享数据
     * */
    initShareData:function(){
        this.setData({
            isDraw:true
        });
        let originalData= this.data.limitData;
        let shareData=new Array();
        if (originalData.length>=6){
            shareData=originalData.slice(0,6);
        }else {
            shareData=originalData;
        }
        let shareLocalData=new Array();
        this.downLoadImage(shareLocalData,0,shareData);
    },
    /**
     * 下载分享文件
     * */
    downLoadImage: function(shareLocalData, i = 0,shareData) {
        yd.util.log("下载文件")
        let that = this;
        if (i < shareData.length) {
            if (shareData[i].listImg) {
                wx.downloadFile({
                    url: shareData[i].listImg,
                    success: function (res) {
                        shareLocalData.push(res.tempFilePath)
                        that.downLoadImage(shareLocalData, ++i,shareData);
                    },
                    fail: function (res) {
                        wx.hideLoading();
                    }
                })
            }else {
                shareLocalData.push("/load-image/load-image-type-1.png")
                that.downLoadImage(shareLocalData, ++i,shareData);
            }
        } else {
            yd.util.log(shareLocalData);
            for (let j = shareLocalData.length; j < 6; j++) {
                shareLocalData.push("/load-image/load-image-type-1.png")
            }
            that.draw(shareLocalData);
        }
    },

    draw: function(shareLocalData) {
        const ctx = wx.createCanvasContext('shareCanvasMini');
        if (ctx.measureText) {
            let shareData= this.data.limitData;
            //绘制背景
            ctx.save();
            easyCanvas.drawRoundRect(ctx,"#FFF", 0, 0, 420, 336,0);
            //绘制标题
            let startT=yd.util.formatTime(shareData[0].startDate / 1000, "M月D日 h:m");
            let endT=yd.util.formatTime(shareData[0].endDate / 1000, "D日h:m");
            easyCanvas.drawText(ctx,startT+"～"+endT,24,'#808080',0,30,true);
            //绘制商品
            for (let i = 0; i < shareLocalData.length; i++) {
                //绘制商品图
                ctx.restore();
                ctx.save();
                let left=140*(i%3);
                let top=38+Math.floor(i/3)*152;
                easyCanvas.drawRoundRect(ctx,"#FFF", left, top, 134, 140, 6);
                easyCanvas.drawImage(ctx,shareLocalData[i],left, top, 134, 108);
                if (shareLocalData[i]!="/load-image/load-image-type-1.png") {
                    easyCanvas.drawText(ctx,"¥",14,'#FF5A5A',left+2,top+140,true);
                    let pw = easyCanvas.drawText(ctx,shareData[i].sellPrice,24,'#FF5A5A',left+12,top+140,true);
                    //绘制划线价
                    if (shareData[i].marketPrice&&shareData[i].marketPrice!=0) {
                        let p2w=easyCanvas.drawText(ctx,"¥"+shareData[i].marketPrice,16,'#808080',left+18+pw,top+140,true);
                        easyCanvas.drawLine(ctx,left + 18 + pw,top + 134,left + 18 + pw + p2w,top + 134,1,'#808080');
                    }
                }
                ctx.restore();
            }

            let that = this;
            ctx.draw(false,
                function(res) {
                    yd.util.log("绘制结束回调")
                    that.setData({
                        isDrawSuccess: true
                    });
                    easyCanvas.save2Memory(that,"shareCanvasMini").then(res=>{
                        yd.util.log("图片成功保存");
                        that.setData({
                            sharePath: res,
                            isDraw:false
                        });
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
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                }
            });
            wx.hideLoading();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that=this;
        that.setData({
            shareBoxBl: true
        });
        let userId = wx.getStorageSync('userId');
        
        if (that.data.sessionList!=null&&that.data.sessionList.length!=0) {
            getApp().tdsdk.event({
                id: '商品分享-限时限购列表',
                label: '商品分享-限时限购列表',
                params: {
                    from: userId,
                    activity_id: that.data.sessionList[that.data.sessionIndex].id,
                    activity_name: that.data.sessionList[that.data.sessionIndex].shortName
                }
            });
        }
        getApp().tdsdk.share({
            title:"限时限购",
            path: `packagepower/pages/limittime/limittime?activityId=${that.data.activityId}&userCode=${userId}`
        });
        let name=that.data.sessionList[that.data.sessionIndex].statusFlag==1?"件商品正在抢购，全场包邮哦~":"件商品抢购就要开始啦，全场包邮哦~";
        return {
            title:that.data.sessionList[that.data.sessionIndex].shortName+that.data.limitData.length+name,
            imageUrl: that.data.isDraw?"":that.data.sharePath,
            path: `packagepower/pages/limittime/limittime?activityId=${that.data.activityId}&userCode=${userId}`
        }
    },
})({
    onPageScroll: true,
    onShow: true
}))
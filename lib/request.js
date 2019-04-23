const config=require("../config.js")
module.exports = (options) => {
  return new Promise((resolve, reject) => {
    //基础参数封装
    let sysInfo = wx.getStorageSync("sys_info");
    let header = {};
    if (sysInfo == "") {
      header = {
        versionCode:config.versionCode,
        token: wx.getStorageSync("token"),
      }
    } else {
      header = {
        versionCode:config.versionCode, //版本号
        token: wx.getStorageSync("token"), //token
        brand: sysInfo.brand, //手机品牌
        model: sysInfo.model, //手机型号
        pixelRatio: sysInfo.pixelRatio, //设备像素比
        screenWidth: sysInfo.screenWidth, //屏幕宽度
        screenHeight: sysInfo.screenHeight, //屏幕高度
        language: sysInfo.language, //微信设置的语言
        version: sysInfo.version, //微信版本号
        system: sysInfo.system, //操作系统版本
        platform: sysInfo.platform, //客户端平台
        SDKVersion: sysInfo.SDKVersion //客户端基础库版本
      }
    }
    header = Object.assign(header, options.header)
    console.log(header);
    options = Object.assign(options,{
      header: header,
      success(result) {
        if (result.data.code == -2) {
          wx.setStorageSync("tryTimes",wx.getStorageSync("tryTimes")?wx.getStorageSync("tryTimes")+1:1);
          console.log("tryTime===>"+wx.getStorageSync("tryTimes"));
          console.log(result)
          if (wx.getStorageSync("tryTimes")&&wx.getStorageSync("tryTimes")<10) {
              const yd = getApp().globalData;
              getApp().login(true).then(res => {
                  // let url = yd.util.getPagesRoute()
                  // yd.util.commonNavigator(url, 'redirect')
                  let headerToken = {
                      token: wx.getStorageSync("token")
                  };
                  header = Object.assign(header, headerToken);
                  options = Object.assign(options, {header: header});
                  wx.request(options);
              }).catch((error) => {
                  console.log('error', error)
              })
          }
        } else if (result.statusCode === 200) {
          wx.setStorageSync("tryTimes",null);
          if (result.header.rstoken) {
            resolve(result)
            return
          }
          resolve(result.data)
        } else {
          reject(result);
        }
      },
      fail(result) {
        reject(result);
      },
    });
    console.log("--request--")

    wx.request(options);
  });
};
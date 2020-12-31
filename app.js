//app.js
const util = require('./utils/util.js')
const api = require('./utils/api.js')
App({
    // 监听小程序初始化。小程序初始化完成时（全局只触发一次）
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        
        //如果缓存中没有openid 则获取openid
        // if (!util.getStorageOpenid()) {
            util.getOpenid(); //获取用户openid
        // }

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        // 可以将 res 发送给后台解码出 unionId 
                        success: res => {
                            console.log(999999999)
                            this.globalData.userInfo = res.userInfo
                            wx.setStorageSync("nickName", res.userInfo.nickName);
                            wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl);
                            wx.setStorageSync("getUserInfo", res);
                            console.log('globalData',this.globalData)
                            console.log('授权用户信息',res)
                            //如果缓存中没有unionid 则获取unionid
                            // if (!util.getStorageUnionid()) { 
                            //     console.log(99999999)
                            //     util.getUnionid();
                            // }
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        // 获取系统状态栏信息（为colorUI所用）
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let capsule = wx.getMenuButtonBoundingClientRect();
                if (capsule) {
                this.globalData.Custom = capsule;
                this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
                } else {
                this.globalData.CustomBar = e.statusBarHeight + 50;

                }
            }
        })
    },
    // 监听小程序显示。小程序启动，或从后台进入前台显示时
    onShow: function(options) {

    },
    // 监听小程序隐藏。小程序从前台进入后台时。
    onHide: function() {

    },
    // 错误监听函数。小程序发生脚本错误，或者 api 调用失败时触发，会带上错误信息
    onError: function(msg) {
        console.log(msg)
    },
    // 页面不存在监听函数。小程序要打开的页面不存在时触发，会带上页面信息回调该函数
    onPageNotFound: function(res) {
        
    },
    globalData: {
        userInfo: null
    }
})
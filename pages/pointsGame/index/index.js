const util =  require('../../../utils/util.js')
const api = require('../../../utils/api.js') //公用方法
//获取应用实例
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
			})
		} else if (this.data.canIUse){
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true,
					})
				}
			})
		}
    },
    /**
     * 接收组件传的值 - 子传父
     */
	onEmpowerData: function (e) {
		this.setData({
			hasUserInfo: e.detail.hasUserInfo,
			canIUse: e.detail.canIUse
		})
		wx.setStorageSync('hasUserInfo', e.detail.hasUserInfo)
		wx.setStorageSync('canIUse', e.detail.canIUse)

		console.log(7777,this.data.hasUserInfo,this.data.canIUse)
	},
    /**
     * 监听底部tab切换事件
     */
	onTabItemTap(item) {
		if(wx.getStorageSync("hasUserInfo")) {
			this.setData({
				hasUserInfo: wx.getStorageSync("hasUserInfo")
			})
		}
		if(wx.getStorageSync("canIUse")) {
			this.setData({
				canIUse: wx.getStorageSync("canIUse")
			})
		}
    },
    /**
     * 点击事件
     */
	bindLinkTap: function(e) {
		if(!this.data.hasUserInfo && this.data.canIUse) {
			var empower = this.selectComponent("#empowerModal");
            empower.show();
            return false
		} else {
			if(e.currentTarget.dataset.target=='rotary') {
				wx.navigateTo({
					url: '../rotary/rotary'
				})
			} else if(e.currentTarget.dataset.target=='lottery') {
				wx.navigateTo({
					url: '../lottery/lottery'
				})
			}
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
  
    }
  })
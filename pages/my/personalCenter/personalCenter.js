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
		isClicked: false, //防止重复点击

        nickName: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
		alerdySign: false,
		Status: '',
		SignPoint: '', //签到积分
        signPoint: 0, //总积分
    },
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
		if (!util.getStorageOpenid()) {
			console.log(888777)
			//获取用户openid
			util.getOpenid().then((res)=> {
				this.getIsSign(); //查询是否签到
				this.GetSignPoint()
			});
        } else {
			console.log(88888888)
			this.getIsSign(); //查询是否签到
            this.GetSignPoint()
        }
        this.setData({
			nickName: wx.getStorageSync('nickName'),
			avatarUrl: wx.getStorageSync('avatarUrl'),
		})
    },
    // 接收组件传的值 - 子传父
	onEmpowerData: function (e) {
		this.setData({
			hasUserInfo: e.detail.hasUserInfo,
			canIUse: e.detail.canIUse
		})
		wx.setStorageSync('hasUserInfo', e.detail.hasUserInfo)
		wx.setStorageSync('canIUse', e.detail.canIUse)
        console.log(7777,this.data.hasUserInfo,this.data.canIUse)
        if(e.detail.hasUserInfo && e.detail.canIUse) {
            this.setData({
                nickName: wx.getStorageSync('nickName'),
                avatarUrl: wx.getStorageSync('avatarUrl'),
            })
		}
	},
	// 监听底部tab切换事件
	onTabItemTap(item) {
		this.GetSignPoint()
		this.getIsSign()
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
		this.setData({
			nickName: wx.getStorageSync('nickName'),
            avatarUrl: wx.getStorageSync('avatarUrl'),
		})
	},
	// 查询是否签到
	getIsSign(e) {
		let that = this;
		api.getIsSign(function (res) {
			if(res.code == 10000) {
				if(res.data.IsSign == 1) {
					that.setData({
						alerdySign: true
					})
				} else {
					that.setData({
						alerdySign: false
					})
				}
				console.log(21121)
			}
		},function (err) {})
	},
	// 获取积分
	GetSignPoint(e) {
		let that = this;
		api.GetSignPoint(function (res) {
			if (res.code == 10000) {
				if(res.data==null) {
					that.setData({
						signPoint: 0
					})
				} else {
					that.setData({
						signPoint: res.data
					})
				}
			} else {
				that.setData({
					signPoint: 0
				})
				util.showToast(res.msg,'')
			}
		},function (err) {
			util.showToast('网络异常','')
		})
	},
    // 立即签到
	getInSign(e) {
		if(!this.data.hasUserInfo && this.data.canIUse) {
			var empower = this.selectComponent("#empowerModal");
			empower.show();
		} else {
			let that = this;
			api.isClicked(that);
			const dataParams = JSON.stringify({
				Wchat: wx.getStorageSync('openId'),
				NickName: wx.getStorageSync('nickName'),
				avatarUrl: wx.getStorageSync('avatarUrl'),
			});
			api.getInSign(dataParams,function (res) {
				if(res.code == 10000) {
					console.log('签到成功',res)
					that.setData({
						alerdySign: true,
						Status: res.data.Status,
						SignPoint: res.data.SignPoint, //签到积分
					})
					that.showModal(e);
					that.GetSignPoint()
				} else {
					util.showToast('网络异常','')
				}
			},function (err) {
				util.showToast('网络异常','')
			})
		}
	},
    bindLink(e) {
        if(!this.data.hasUserInfo && this.data.canIUse) {
			var empower = this.selectComponent("#empowerModal");
			empower.show();
		} else {
            if(e.currentTarget.dataset.link == 'integralRecord') {
                wx.navigateTo({
                    url: '../../signIn/integralRecord/integralRecord'
                })
            } else if(e.currentTarget.dataset.link == 'myOrders') {
                wx.navigateTo({
                    url: '../../order/myOrders/myOrders'
                })
            } else if(e.currentTarget.dataset.link == 'info') {
                wx.navigateTo({
                    url: '../info/info'
                })
            }
        }
    },
    // 显示弹框
	showModal(e) {
		if(!this.data.hasUserInfo && this.data.canIUse) {
			var empower = this.selectComponent("#empowerModal");
			empower.show();
		} else {
			if(e.currentTarget.dataset.target == 'successModal') {
				console.log('this.data.Status',this.data.Status)
				var successM = this.selectComponent("#successModal");
				successM.setInfo('signin',this.data.Status,this.data.SignPoint);
				successM.show();
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
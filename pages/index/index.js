const util =  require('../../utils/util.js')
const api = require('../../utils/api.js') //公用方法
//获取应用实例
const app = getApp()
Page({
	data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		// 公告栏
		text: [],
        animation: null,
        timer: null,
        duration: 0,
        textWidth: 0,
		wrapWidth: 0,
		
		bannerList: [], //banner列表
		bannerIndex: 3, //banner图点击选中的索引
		isClicked: false, //防止重复点击
		inputValue: 1, //数量输入框值
		inputExcelValue: 800, //数量输入框值-excel专用
		numValue: null,

		modalName: '',	//弹框
		modalIndex: '',
		alerdySign: false, //是否已经签到
		Status: '',
		SignPoint: '', //签到积分

		cardData: [], //商品数据数组
        page: 0,
        page_size: 10,
        cardLength: null, //数据是否为空
        isShowLoadmore:false, //正在加载 
        isShowNoDatasTips:false, //数据加载完
		endloading: false, //判断是否还有数据

		noticeShow: true, //公告是否显示
		Welfare: null, //新客福利额度
		IconLink: null, //二维码

		eCellNum: 800, //eCell兑换起始值
	},
	onLoad: function () {
		if (app.globalData.userInfo) {
			console.log(1)
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
			})
		} else if (this.data.canIUse){
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				console.log(2)
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					console.log(3)
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true,
					})
				}
			})
		}
		//如果缓存中没有openid 则获取openid
        if (!util.getStorageOpenid()) { 
			// 获取用户openid
			util.getOpenid().then((res)=> {
				this.getIsSign(); //查询是否签到
			});
        } else {
			this.getIsSign(); //查询是否签到
		}
		this.reviewpage();
		this.GetBanner();
		this.GetMinECellTrade();
		setTimeout(()=> {
			this.setData({
				noticeShow: false
			})
		},60000)
	},
	onHide() {
        // this.destroyTimer()
        this.setData({
        	timer: null
        })
    },
    onUnload() {
        // this.destroyTimer()
        this.setData({
        	timer: null
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
	},
	// 监听底部tab切换事件
	onTabItemTap(item) {
		this.getIsSign();
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
	destroyTimer() {
        if (this.data.timer) {
        	clearTimeout(this.data.timer);
        }
	},
	/**
	* 开启公告字幕滚动动画
	* @param {String} text 公告内容
	* @return {[type]} 
	*/
    initAnimation(text) {
        let that = this
        this.data.duration = 15000
        this.data.animation = wx.createAnimation({
         	duration: this.data.duration,
         	timingFunction: 'linear'  
        })
        let query = wx.createSelectorQuery()
        query.select('.content-box').boundingClientRect()
        query.select('#text').boundingClientRect()
        query.exec((rect) => {
			that.setData({
				wrapWidth: rect[0].width,
				textWidth: rect[1].width
			}, () => {
				this.startAnimation()
			})
        })
	},
	// 定时器动画
	startAnimation() {
        // this.data.animation.option.transition.duration = 0
        const resetAnimation = this.data.animation.translateX(this.data.wrapWidth).step({ duration: 0 })
        this.setData({
         	animationData: resetAnimation.export()
        })
        // this.data.animation.option.transition.duration = this.data.duration
        const animationData = this.data.animation.translateX(-this.data.textWidth).step({ duration: this.data.duration })
        setTimeout(() => {
			this.setData({
				animationData: animationData.export()
			})
        }, 100)
        const timer = setTimeout(() => {
         	this.startAnimation()
        }, this.data.duration)
        this.setData({
         	timer
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
			}
		},function (err) {
			util.showToast(err,'')
		})
	},
	/**
	 * 获取banner
	 */
	GetBanner() {
		let that = this;
		api.GetBanner(function (res) {
			console.log(7777,res)
			if(res.code == 10000) {
				let data = '';
				for(var i in res.data.AnList) {
					data = data.concat(res.data.AnList[i].Text+'　　　　　　');
				}
				that.setData({
					bannerList: res.data.List,
					text: data
				})
				console.log(55555,that.data.text,that.data.bannerList)
				that.initAnimation(that.data.text)
			} else if(res.code == -10000) {
				util.showToast(res.msg,'')
			}
		},function (err) {
			
		})
	},
	// 获取eCell兑换数量
	GetMinECellTrade(e) {
		let that = this;
		api.GetMinECellTrade(function (res) {
			console.log(res)
			if(res.code == 10000) {
				that.setData({
					eCellNum: res.data,
				})
			} else {
				util.showToast('网络异常','')
			}
		},function (err) {})
	},
	// 数据懒加载 - 商品
	reviewpage: function(e){
		var that = this;
		var page = this.data.page;
		const dataParams = JSON.stringify({
			Start: that.data.page,
			Num: that.data.page_size,
		});
		console.log('商品参数',dataParams)
		api.GetAllGoodsList(dataParams,function (res) {
			if(res.code == 10000) {
				var datas = res.data.Result;
				that.setData({
					cardData: that.data.cardData.concat(datas)  //将得到的评论添加到cardData 中 更新
				})
				if (datas.length < that.data.page_size){ //如果剩下评论数 小于10表示数据加载完了
					console.log('已经加载完了')
					that.setData({
						isShowLoadmore: true, //隐藏正在加载
						isShowNoDatasTips: true, //显示数据加载完
						endloading: true, //上拉不在加载
					})
				}
				if(that.data.page == 0) {
					if(datas.length==0) {
						that.setData({
							cardLength: true
						})
					}
				}
				that.setData({
					page:page + 10 //更新page 请求下一页数据
				})
			} else{
				console.log('请求错误')
			}
		},function (err) {})
	},
	//事件处理函数
	bindLinkTap: function(e) {
		if(!this.data.hasUserInfo && this.data.canIUse) {
			var empower = this.selectComponent("#empowerModal");
			empower.show();
		} else {
			if(e.currentTarget.dataset.target=='signIn') {
				wx.navigateTo({
					url: '../signIn/signIn/signIn'
				})
			} else if(e.currentTarget.dataset.target=='myOrders') {
				wx.navigateTo({
					url: '../order/myOrders/myOrders'
				})
			} else if(e.currentTarget.dataset.target=='rotary') {
				wx.navigateTo({
					url: '../rotary/rotary/rotary'
				})
			} else if(e.currentTarget.dataset.target=='confirmOrder') {
				let index = e.currentTarget.dataset.index;
				console.log('this.data.numValue',this.data.numValue)
				wx.navigateTo({
					url: '../order/confirmOrder/confirmOrder?ID=' + this.data.cardData[index].ID + '&Title=' + this.data.cardData[index].Title + '&convertNum=' + this.data.cardData[index].Point + '&inputvalue=' + this.data.numValue + '&iconAddress=' + this.data.cardData[index].IconAddress + '&Content=' + this.data.cardData[index].Content + '&Category=' + this.data.cardData[index].Category
				})
			}
		}
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
				} else {
					util.showToast('网络异常','')
				}
			},function (err) {})
		}
	},
	// 获取新用户福利
	GetUserWelfare(e) {
		console.log(222,e)
		let that = this;
		api.GetUserWelfare('',function (res) {
			console.log(res)
			if(res.code == 10000) {
				that.setData({
					Welfare: res.data.Welfare,
					IconLink: res.data.IconLink
				})
				that.showModal(e);
				wx.setClipboardData({
					data: res.data.WchatNumber,
					success: function (res) {
						wx.getClipboardData({
							success: function (res) {
								wx.hideLoading();
							}
						})
					}
				})
			} else {
				util.showToast('网络异常','')
			}
		},function (err) {})
	},
	// 显示弹框
	showModal(e) {
		if(!this.data.hasUserInfo && this.data.canIUse) {
			var empower = this.selectComponent("#empowerModal");
			empower.show();
		} else {
			if(e.currentTarget.dataset.target == 'successModal') {
				var successM = this.selectComponent("#successModal");
				successM.setInfo('signin',this.data.Status,this.data.SignPoint);
				successM.show();
			} else if(e.currentTarget.dataset.target == 'bannerModal') {
				console.log(4444,e.currentTarget.dataset)
				if(e.currentTarget.dataset.type=="弹框") {
					this.setData({
						modalName: e.currentTarget.dataset.target,
						bannerIndex: e.currentTarget.dataset.index,
					})
				}
			}else {
				this.setData({
					modalName: e.currentTarget.dataset.target,
					modalIndex: e.currentTarget.dataset.index,
				})
				if(e.currentTarget.dataset.type == "ecell") {
					this.setData({
						numValue: this.data.inputExcelValue
					})
					console.log(444,this.data.numValue)
				} else {
					this.setData({
						numValue: this.data.inputValue
					})
				}
			}
		}
	},
	// 隐藏弹框
	hideModal(e) {
		this.setData({
			modalName: null,
			inputValue: 1,
			inputExcelValue: 800
		})
	},
	// 数量输入框值改变事件
	bindinput(e) {
		if(e.currentTarget.dataset.type=='ecell') {
			this.setData({
				inputExcelValue: e.detail.value,
				numValue: e.detail.value
			})
		} else {
			this.setData({
				inputValue: e.detail.value,
				numValue: e.detail.value
			})
		}
	},
	// 数量 ‘ - ’点击
	clickCut(e) {
		let num = null;
		if(e.currentTarget.dataset.type=='ecell') {
			if(this.data.inputExcelValue <= 800) {
				num = 800;
			} else {
				num = this.data.inputExcelValue - 1;
			}
			this.setData({
				inputExcelValue: num,
				numValue: num
			})
		} else {
			if(this.data.inputValue <= 1) {
				num = 1;
			} else {
				num = this.data.inputValue - 1;
			}
			this.setData({
				inputValue: num,
				numValue: num
			})
		}
	},
	// 数量 ‘ + ’点击
	clickAdd(e) {
		console.log(111,e.currentTarget.dataset)
		if(e.currentTarget.dataset.type=='ecell') {
			let num = Number(this.data.inputExcelValue) + 1;
			this.setData({
				inputExcelValue: num,
				numValue: num
			})
		} else {
			let num = Number(this.data.inputValue) + 1;
			this.setData({
				inputValue: num,
				numValue: num
			})
		}
	},
	// 点击复制功能
	copyText: function (e) {
		console.log(e)
		wx.setClipboardData({
			data: e.currentTarget.dataset.text,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						util.showToast('复制成功', 'success');
					}
				})
			}
		})
	},
	/**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log(222)
        var that = this;
        var endloading = that.data.endloading
        if (!endloading){
            that.reviewpage()  //页面上拉调用这个方法
        }
    },
})
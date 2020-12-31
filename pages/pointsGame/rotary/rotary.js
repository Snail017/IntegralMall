// 上下文对象
var that;
const util =  require('../../../utils/util.js')
const api = require('../../../utils/api.js') //公用方法

Page({
	data: {
		is_play: false, // 是否在运动中，避免重复启动bug
		available_num: 0, // 可用抽奖的次数，可自定义设置或者接口返回
		start_angle: 0, // 转动开始时初始角度=0位置指向正上方，按顺时针设置，可自定义设置
		base_circle_num: 9, // 基本圈数，就是在转到（最后一圈）结束圈之前必须转够几圈 ，可自定义设置
		low_circle_num: 5, // 在第几圈开始进入减速圈（必须小于等于基本圈数），可自定义设置
		add_angle: 10, // 追加角度，此值越大转动越快，请保证360/add_angle=一个整数，比如1/2/3/4/5/6/8/9/10/12等
		use_speed: 1, // 当前速度，与正常转速值相等
		nor_speed: 1, // 正常转速，在减速圈之前的转速，可自定义设置
		low_speed: 10, // 减速转速，在减速圈的转速，可自定义设置
		end_speed: 20, // 最后转速，在结束圈的转速，可自定义设置
		random_angle: 320, // 中奖角度，也是随机数，也是结束圈停止的角度，这个值采用系统随机或者接口返回
		change_angle: 0, // 变化角度计数，0开始，一圈360度，基本是6圈，那么到结束这个值=6*360+random_angle；同样change_angle/360整除表示走过一整圈
		result_val: "未中奖", // 存放奖项容器，可自定义设置
		Jack_pots: [ // 奖项区间 ，360度/奖项个数 ，一圈度数0-360，可自定义设置
		// random_angle是多少，在那个区间里面就是中哪个奖项
			{
				startAngle: 1,
				endAngle: 59,
				val: "5倍"
			},
			{
				startAngle: 61,
				endAngle: 119,
				val: "10倍"
			},
			{
				startAngle: 121,
				endAngle: 179,
				val: "0.5倍"
			},
			{
				startAngle: 181,
				endAngle: 239,
				val: "谢谢参与"
			},
			{
				startAngle: 241,
				endAngle: 299,
				val: "盲盒"
			},
			{
				startAngle: 301,
				endAngle: 359,
				val: "2倍"
			}
		],
		modalName: null,
		signPoint: 0, //积分余额
		time: 0, //剩余次数
		FreeTimes: 0, //免费次数
		SetFreeTimes: '', //活动设置的免费次数
		record_list: [],
		allUsedPoint: 0,
		allBonusPoint: 0,
		ShareTimes: 0, //分享次数
		shareflg: true,
	},
	onLoad: function (options) {
		that = this;
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
		this.GetSignPoint()
		this.GetShareTimes()
		this.GetPrizeTimes();
	},
	/**
	 * 获取积分
	 */
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
	/**
	 * 获取分享次数
	 */
	GetShareTimes(e) {
		let that = this;
		api.GetShareTimes(function (res) {
			if (res.code == 10000) {
				if(res.data.Status==1) {
					that.setData({
						ShareTimes: res.data.ShareTimes
					})
				} else {
					that.setData({
						ShareTimes: 0
					})
				}
			}
		},function (err) {
			util.showToast('网络异常','')
		})
	},
	/**
	 * 获取次数
	 */
	GetPrizeTimes() {
		const dataParams = JSON.stringify({
			Wchat: wx.getStorageSync('openId'),
		});
		api.GetPrizeTimes(dataParams, function (res) {
			if (res.code == 10000) {
				if(res.data.TotalTimes==null) {
					that.setData({
						time: 0,
						FreeTimes: 0,
						SetFreeTimes: 0
					})
				} else {
					that.setData({
						time: res.data.TotalTimes,
						FreeTimes: res.data.FreeTimes,
						SetFreeTimes: res.data.SetFreeTimes
					})
				}
			} else {
				that.setData({
					time: 0,
					FreeTimes: 0,
					SetFreeTimes: 0
				})
				util.showToast(res.msg,'')
			}
		}, function (err) {
			util.showToast('网络异常','')
		})
	},
	/**
	 * 增加次数
	 */
	AddPrizeTimes() {
		console.log(777777)
		api.AddPrizeTimes(function (res) {
			if (res.code == 10000) {
				if (res.data.Status == 0) {
					util.showToast('今日分享次数已用完，请明天再来','fail')
				}
				that.setData({
					ShareTimes: res.data.ShareTimes
				})
			}
		}, function (err) {
			util.showToast('网络异常','')
		})
	},
	/**
	 * 总消耗积分和奖励积分
	 */
	GetTodayPoint() {
		api.GetTodayPoint(function (res) {
			if (res.code == 10000) {
				that.setData({
					allUsedPoint: res.data.TotalUsed,
					allBonusPoint: res.data.TotalBonus
				})
			}
		}, function (err) {
			util.showToast('网络异常','')
		})
	},
	/**
	 * 获取抽奖记录
	 */
	GetPrizeRecord(e) {
		let that = this;
		api.GetPrizeRecord(function (res) {
			if (res.code == 10000) {
				that.setData({
					record_list: res.data.Result
				})
			}
		}, function (err) {
			util.showToast('网络异常','')
		})
	},
  	/**
   * 积分抽奖
   */
	PrizeDraw: function () {
		return new Promise(function (resolve, reject) {
			api.PrizeDraw(function (res) {
				if (res.code == 10000) {
					resolve(res.data)
				} else {
					reject(res)
				}
			}, function (err) {
				util.showToast('网络异常','')
			})
		})
	},
	/**
	 * 分享朋友
	 */
	onShareAppMessage: function (ops) {
		if(that.data.ShareTimes == 10) {
			util.showToast('今日分享次数已用完，请明天再来','fail')
		} else {
			if (that.data.shareflg) {
				that.setData({
					modalName: null,
					shareflg: false
				})
				that.AddPrizeTimes()
				that.GetPrizeTimes()
				setTimeout(() => {
					that.setData({
						shareflg: true
					})
				}, 3000)
			} else {
				util.showToast('操作太频繁啦','fail')
			}
		}
		return {
			title: '积分大转盘',
			path: 'pages/pointsGame/rotary/rotary',
			imageUrl: 'https://ningshui-message.oss-cn-beijing.aliyuncs.com/1600409870824534589-img_fenxiang.png'
		}
	},

	/**
	 * 启动抽奖
	 */
	luckDrawStart: function () {
		if (that.data.time == 0) {
			console.log('that.data.ShareTimes',that.data.ShareTimes)
			if(that.data.ShareTimes == 10) {
				util.showToast('今日分享次数已用完，请明天再来','fail')
				return false
			}
		}
		if(this.data.FreeTimes == 0) {
			if (that.data.signPoint < 9) {
				wx.showModal({
					title: '提示',
					content: '积分不足',
				})
				return false
			}
		}
		// 阻止运动中重复点击
		if (!that.data.is_play) {
			// 设置标识在运动中
			that.setData({
				is_play: true
			});
			if(that.data.FreeTimes>0){
				that.setData({
					FreeTimes:that.data.FreeTimes--
				})
			}
			if (that.data.time == 0) {
				console.log('that.data.ShareTimes',that.data.ShareTimes)
				if(that.data.ShareTimes == 10) {
					util.showToast('今日分享次数已用完，请明天再来','fail')
					return false
				} else {
					that.setData({
						modalName: 'share',
						is_play: false
					})
					return false
				}
			}
			// 重置参数
			that.luckDrawReset();
			// 几率随机，也可从服务端获取几率
			that.PrizeDraw().then(function (res) {
				var ls_random_angle = null;
				var ls_Awards = res.Awards;
				if (ls_Awards == '5') {
				ls_random_angle = 30;
				} else if (ls_Awards == '10') {
				ls_random_angle = 90;
				} else if (ls_Awards == '0.5') {
				ls_random_angle = 150;
				} else if (ls_Awards == 'THX') {
				ls_random_angle = 210;
				} else if (ls_Awards == '2') {
				ls_random_angle = 330;
				} else {
				ls_random_angle = 270;
				}
				that.setData({
					random_angle: ls_random_angle,
					result_val: res,
				});
				that.GetPrizeTimes()
			});
			// 运动函数
			setTimeout(that.luckDrawChange, that.data.use_speed);
		};
	},

	/**
	 * 转盘运动
	 */
	luckDrawChange: function () {
		// 继续运动
		if (that.data.change_angle >= that.data.base_circle_num * 360 + that.data.random_angle) { // 已经到达结束位置
		// 提示中奖，
		that.getLuckDrawResult();
		// 运动结束设置可用抽奖的次数和激活状态设置可用
		that.luckDrawEndset();
		} else { // 运动
		if (that.data.change_angle < that.data.low_circle_num * 360) { // 正常转速
			that.data.use_speed = that.data.nor_speed
		} else if (that.data.change_angle >= that.data.low_circle_num * 360 && that.data.change_angle <= that.data.base_circle_num * 360) { // 减速圈
			that.data.use_speed = that.data.low_speed
		} else if (that.data.change_angle > that.data.base_circle_num * 360) { // 结束圈
			that.data.use_speed = that.data.end_speed
		}
		// 累加变化计数
		that.setData({
			change_angle: that.data.change_angle + that.data.add_angle >= that.data.base_circle_num * 360 + that.data.random_angle ? that.data.base_circle_num * 360 + that.data.random_angle : that.data.change_angle + that.data.add_angle
		});
		setTimeout(that.luckDrawChange, that.data.use_speed);
		}

	},

	/**
	 * 重置参数
	 */
	luckDrawReset: function () {
		// 转动开始时首次点亮的位置，可自定义设置
		that.setData({
			start_angle: 0
		});
		// 当前速度，与正常转速值相等
		that.setData({
			use_speed: that.data.nor_speed
		});
		// 中奖索引，也是随机数，也是结束圈停止的位置，这个值采用系统随机或者接口返回
		that.setData({
			random_angle: 0
		});
		// 变化计数，0开始，必须实例有12个奖项，基本是6圈，那么到结束这个值=6*12+random_number；同样change_num/12整除表示走过一整圈
		that.setData({
			change_angle: 0
		});
	},

	/**
	 * 获取抽奖结果
	 */
	getLuckDrawResult: function () {
		for (var j = 0; j < that.data.Jack_pots.length; j++) {
			if (that.data.random_angle >= that.data.Jack_pots[j].startAngle && that.data.random_angle <= that.data.Jack_pots[j].endAngle) {
				that.setData({
					signPoint: that.data.result_val.Point,
					modalName: Number(that.data.result_val.Awards) > 0 ? 'jifen' : (that.data.result_val.Awards == 'THX' ? null : 'manghe')
				});
				wx.setStorageSync("signPoint", that.data.result_val.Point);
				if (that.data.result_val.Awards == 'THX') {
					util.showToast('感谢参与','')
				}
				break;
			};
		};
	},

	/**
	 * 更新状态（运动结束设置可用抽奖的次数和激活状态设置可用）
	 */
	luckDrawEndset: function () {
		// 是否在运动中，避免重复启动bug
		that.setData({
		is_play: false
		})
		// 可用抽奖的次数，可自定义设置
		that.setData({
		available_num: that.data.available_num - 1
		});
	},
	// 弹框显示
	showModel: function (e) {
		let type = e.currentTarget.dataset['type'];
		if (type == 'record') {
			that.GetTodayPoint()
			that.GetPrizeRecord();
		}
		if (type == 'weixin') {
			that.setData({
				modalName: 'weixin'
			})
		}
		that.setData({
			modalName: type
		})
	},
	// 弹框隐藏
	hideModal: function () {
		this.setData({
			modalName: null
		})
	},
	toRule: function () {
		wx.navigateTo({
			url: '../rule/rule'
		})
	},
})
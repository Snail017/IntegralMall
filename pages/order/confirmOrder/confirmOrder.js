const util =  require('../../../utils/util.js')
const api =  require('../../../utils/api.js')
import WxValidate from '../../../utils/WxValidate.js' //表单验证方法
Page({
	data: {
		signPoint: 0, //可用积分
		accountAddress: '',	//以太坊地址
		ShopAddress: '', //门店地址
		WchatNo: '', //微信号
		phone: '', //手机号
		ID: '', //兑换的商品id
		Title: '', //兑换商品名
		Content: '', //兑换商品说明
		convertNum: '', //兑换商品积分
		inputvalue: '', //兑换商品数量
		iconAddress: '', //兑换商品图片地址
		Category: '', //兑换商品类别
		fillAll: false,
		isClicked: false, //防止重复点击

		//....................................用户输入支付操作 - 暂时搁置................................
		showType:'number',//如果是密码换成'password'
    	isFocus: false,
		dataSource: [
			{initValue: ''},
			{initValue: ''},
			{initValue: ''},
			{initValue: ''},
			{initValue: ''},
			{initValue: ''},
		],
	},
	onLoad: function (options) {
		console.log(options)
		this.GetPersonal()
		this.GetSignPoint(); //获取积分
		this.setData({
			ID: options.ID,
			Title: options.Title,
			Content: options.Content,
			convertNum: options.convertNum,
			inputvalue: options.inputvalue,
			iconAddress: options.iconAddress,
			Category: options.Category,
		})
		this.initValidate() //验证规则函数
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
	// 获取个人信息
	GetPersonal(e) {
		let that = this;
		api.GetPersonal(function (res) {
			if(res.code == 10000) {
				that.setData({
					phone: res.data.Phone,
                    WchatNo: res.data.WchatName,
                    accountAddress: res.data.Address,
				})
			}
		},function (err) {})
	},
	//验证函数
	initValidate() {
		if (this.data.Category=='starbucks') {
			// 星巴克
			const rules = {
				WchatNo: {
					required: true,
					wechat: true,
				},
				phone: {
					required: true,
					tel: true,
				},
			}
			const messages = {
				WchatNo: {
					required: '请输入微信号',
					wechat: '请输入正确的微信号'
				},
				phone: {
					required: '请输入手机号码',
					tel: '请输入正确的手机号码',
				},
			}
			this.WxValidate = new WxValidate(rules, messages)
		} else if(this.data.Category=='starbucks') {
			const rules = {
				WchatNo: {
					required: true,
					wechat: true,
				},
			}
			const messages = {
				WchatNo: {
					required: '请输入微信号',
					wechat: '请输入正确的微信号'
				},
			}
			this.WxValidate = new WxValidate(rules, messages)
		} else {
			const rules = {
				phone: {
					required: true,
					tel: true,
				},
			}
			const messages = {
				phone: {
					required: '请输入手机号码',
					tel: '请输入正确的手机号码',
				},
			}
			this.WxValidate = new WxValidate(rules, messages)
		}
	},
	// 监听以太坊地址输入
	bindTextArea(e) {
		this.setData({
			accountAddress: e.detail.value
		});
	},
	// 监听input框输入
	bindinput(e) {
		if(e.currentTarget.dataset.target == 'kdj') {
			this.setData({
				ShopAddress: e.detail.value
			});
		} else if(e.currentTarget.dataset.target == 'xbk') {
			this.setData({
				WchatNo: e.detail.value
			});
		} else {
			this.setData({
				phone: e.detail.value
			});
		}
	},
	// 提交订单 - 兑换商品
	formSubmit: function(e) {
		console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    	const params = e.detail.value
		if (!this.WxValidate.checkForm(params)) {
			const error = this.WxValidate.errorList[0]
			console.log(this.WxValidate.errorList)
			util.showToast(error.msg, '');
			return false
		} else {
			let that = this;
			api.isClicked(that);
			const dataParams = JSON.stringify({
				Wchat: wx.getStorageSync('openId'),
				AccountAddress: that.data.accountAddress,
				WchatNo: that.data.WchatNo,
				ShopAddress: that.data.ShopAddress,
				Phone: that.data.phone,
				ID: Number(that.data.ID),
				Num: Number(that.data.inputvalue)
			});
			console.log(dataParams)
			api.getPointsFor(dataParams,function (res) {
				console.log('提交订单接口返回参数',res)
				if(res.code == 10000) {
					// that.showModal('DialogModal')
					var successM = that.selectComponent("#successModal");
					successM.setInfo('confirm');
					successM.show();
					that.setData({
						fillAll: true
					})
				}
			},function (err) {
				util.showToast(网络异常, '');
			})
		}
	},
	// 显示弹框
	showModal(name) {
		this.setData({
		  modalName: name
		})
	},
	// 隐藏弹框
	hideModal(e) {
		this.setData({
		  modalName: null
		})
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

	// 。。。。。。。。。。。。用户输入支付操作 - 暂时搁置。。。。。。。。。。。。。。
	// 用户tap假的Input,focus到隐藏的input
	onTapFocus: function() {
		this.setData({
			isFocus: true
		});
	},
	// 移动端键入 *注意:在pc端无法显示键盘，移动端下编译、预览正常
  	mobileInput: function(e) {
		let dataSource = this.data.dataSource;
		let curInpArr = e.detail.value.split('');
		let curInpArrLength = curInpArr.length;

		if (curInpArr.length != this.data.dataSource.length)
		for (let i = 0; i < dataSource.length - curInpArrLength; i++)
			curInpArr.push('');

		for (let i = 0; i < this.data.dataSource.length; i++) {
		let initValue = 'dataSource[' + i + '].initValue';
		this.setData({
			[initValue]: curInpArr[i]
		});
		}
  	},
	// 确认支付
	confirmPay() {
		// 调用微信支付
		wx.requestPayment({
			timeStamp: Date.now(),
			nonceStr: '',
			package: '',
			signType: 'MD5',
			paySign: '',
			success (res) { 
				console.log('成功',res)
				wx.navigateTo({
					url: '../../myOrders/myOrders'
				})
			},
			fail (res) { 
				console.log('失败',res)
			}
		})
	},
})
const api =  require('../../../utils/api.js')
const util =  require('../../../utils/util.js')
import WxValidate from '../../../utils/WxValidate.js' //表单验证方法
Page({
    data: {
        avatarUrl: wx.getStorageSync('avatarUrl'),
        Phone: '', //手机号
        WchatName: '', //微信号
        Name: '', //姓名
        Address: '', //以太坊地址
        isClicked: true,
    },
    onLoad: function (options) {
        this.GetPersonal();
        this.initValidate(); //验证规则函数
        this.setData({
            avatarUrl: wx.getStorageSync('avatarUrl'),
        })
    },
    // 获取个人信息
	GetPersonal(e) {
		let that = this;
		api.GetPersonal(function (res) {
			if(res.code == 10000) {
				that.setData({
					Phone: res.data.Phone,
                    WchatName: res.data.WchatName,
                    Name: res.data.Name,
                    Address: res.data.Address,
				})
			}
		},function (err) {})
	},
    // 监听以太坊地址输入
	bindTextArea(e) {
		this.setData({
			Address: e.detail.value
		});
	},
	// 监听input框输入
	bindinput(e) {
		if(e.currentTarget.dataset.target == 'phone') {
			this.setData({
				Phone: e.detail.value
			});
		} else if(e.currentTarget.dataset.target == 'wchatname') {
			this.setData({
				WchatName: e.detail.value
			});
		} else {
			this.setData({
				Name: e.detail.value
			});
		}
    },
    //验证函数
	initValidate() {
        const rules = {
            // Phone: {
            //     required: true,
            //     tel: true,
            // },
            WchatName: {
                required: true,
                wechat: true,
            },
        }
        const messages = {
            // Phone: {
            //     required: '请输入手机号码',
            //     tel: '请输入正确的手机号码',
            // },
            WchatName: {
                required: '请输入微信号',
                wechat: '请输入正确的微信号'
            },
        }
        this.WxValidate = new WxValidate(rules, messages)
	},
    // 个人信息保存
	formSubmit: function(e) {
		console.log('个人信息保存form携带的数据为：', e.detail.value)
    	const params = e.detail.value
		if (!this.WxValidate.checkForm(params)) {
			const error = this.WxValidate.errorList[0]
			console.log(this.WxValidate.errorList)
			util.showToast(error.msg, '');
			return false
		} else {
			let that = this;
			that.setData({
				isClicked: false
			})
			setTimeout(function () {
				that.setData({
					isClicked: true
				})
			}, 2000)
			const dataParams = JSON.stringify({
				Wchat: wx.getStorageSync('openId'),
				Phone: that.data.Phone,
				WchatName: that.data.WchatName,
				Name: that.data.Name,
                Address: that.data.Address,
			});
			console.log(dataParams)
			api.SavePersonal(dataParams,function (res) {
				console.log('保存个人信息接口返回参数',res)
				if(res.code == 10000) {
					if(res.data.IsSign==1) {
                        util.showToast('保存成功', 'success');
                        setTimeout(function(){
                            wx.switchTab({
                                url: '../personalCenter/personalCenter'
                            })
                        },1500)
                    } else {
                        util.showToast(res.data.msg, '');
                    }
				} else if(res.code == -10000) {
                    if(res.data.Status==1) {
                        util.showToast('微信号已存在', '');
                    }
                }
			},function (err) {
                util.showToast('网络异常', '');
            })
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
})
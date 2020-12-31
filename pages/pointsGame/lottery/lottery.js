const util =  require('../../../utils/util.js')
const api = require('../../../utils/api.js') //公用方法
Page({
    /**
     * 页面的初始数据
     */
    data: {
		Rule: '', //规则内容
		signPoint: '', //我的积分余额
		MinUpPoint: '', //单次参与积分 - 最低
		MaxUpPoint: '',//单次参与积分 - 最大
		getInput: '', //下注积分
		Multiple: '', //固定倍数
		Start: 0, //数据加载的起始值
		Num: 10,  //每页加载的条数
		noLength: null, //数据是否为空
        isShowLoadmore:false, //正在加载
        isShowNoDatasTips:false, //暂无数据
		endloading: false, //判断是否还有数据
		luckylist: [],
		DownPoint: 10, //积分抽奖获得的积分
		pointflg: true,
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		this.GetSignPoint();
		this.GetDrawParam();
		this.reviewpage(false);
    },

	/**
	 * 下注积分变化
	 */
	getInput: function (e) {
		this.setData({
  			getInput: e.detail.value
        })
	},
	/**
	 * 点击抽奖按钮
	 */
	PointDraw(e) {
		if(this.data.getInput < this.data.MinUpPoint) {
			util.showToast('投注积分未达到最小参与限额','')
		} else if(this.data.getInput > this.data.MaxUpPoint) {
			util.showToast('投注积分超过最大参与限额','')
		} else {
			if(this.data.pointflg) {
				let that = this;
				that.setData({
					pointflg: false
				})
				const dataParams = JSON.stringify({
					WchatName:  wx.getStorageSync('nickName'),
					UnionID: wx.getStorageSync('unionid'),
					UpPoint: Number(that.data.getInput)  //下注积分
				});
				api.PointDraw(dataParams,function (res) {
					if(res.code == 10000) {
						if(res.data.Status == 1) {
							that.setData({
								DownPoint: res.data.DownPoint,
								signPoint: (that.data.signPoint - Number(that.data.getInput))+res.data.DownPoint,
								Start: 0,
								Num: 10,
								luckylist: []
							})
							that.showModal(e);
							that.reviewpage(false);
						} else if(res.data.Status == 2)  {
							that.setData({
								signPoint: that.data.signPoint - Number(that.data.getInput),
							})
							util.showToast('差一丢丢就中奖了呢，请继续加油哦。','')
							setTimeout(()=> {
								that.setData({
									Start: 0,
									Num: 10,
									luckylist: []
								})
								that.reviewpage(false);
							},2000)
						}
						setTimeout(()=>{
							that.setData({
								pointflg: true
							},3000)
						})
					} else {
						setTimeout(()=>{
							that.setData({
								pointflg: true
							},3000)
						})
						util.showToast('网络异常','')
					}
				},function (err) {})
			} else {
				util.showToast('操作太频繁啦','fail')
			}
		}
	},
	/**
	 * 获取抽奖信息 - 单次最大参与积分
	 */
	GetDrawParam(e) {
		let that = this;
		api.GetDrawParam('',function (res) {
			if(res.code == 10000) {
				that.setData({
					Rule: res.data.Rule,
					MinUpPoint: res.data.MinUpPoint,
					MaxUpPoint: res.data.MaxUpPoint,
					Multiple: res.data.Multiple
				})
			} else {
				util.showToast('网络异常','')
			}
		},function (err) {})
	},
	/**
	 * 数据懒加载 - 获取中奖名单
	 */
	reviewpage: function(pullShow){
		var that = this;
		var Start = this.data.Start;
		const dataParams = JSON.stringify({
			Start: that.data.Start,
			Num: that.data.Num,
		});
		console.log('商品参数',dataParams)
		api.RankDrawRecordList(dataParams,function (res) {
			if(res.code == 10000) {
				if(res.data.List!=null) {
					var datas = res.data.List;
					that.setData({
						luckylist: that.data.luckylist.concat(datas)  //将得到的评论添加到luckylist 中 更新
					})
					if (datas.length < that.data.Num){ //如果剩下评论数 小于10表示数据加载完了
						console.log('已经加载完了')
						that.setData({
							isShowLoadmore: true, //隐藏正在加载
							isShowNoDatasTips: true, //显示暂无数据
							endloading: true, //上拉不在加载
						})
					}
					if(that.data.Start == 0) {
						if(datas.length==0) {
							that.setData({
								noLength: true
							})
						}
					}
					that.setData({
						Start: Start + 10 //更新Start 请求下一页数据
					})
					if(pullShow) {
						//隐藏导航条加载动画
						wx.hideNavigationBarLoading();
						//停止下拉刷新
						wx.stopPullDownRefresh();
					}
				}
			} else{
				util.showToast('网络异常','')
			}
		},function (err) {})
	},
	/**
	 * 下拉刷新
	 */
	onRefresh(){
        //在当前页面显示导航条加载动画
		wx.showNavigationBarLoading();
		this.setData({
			Start: 0,
			Num: 10,
			noLength: null, //数据是否为空
			isShowLoadmore:false, //正在加载
			isShowNoDatasTips:false, //暂无数据
			endloading: false, //判断是否还有数据
			luckylist: [],
		})
        this.reviewpage(true);
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

	/**
     * 显示弹框
     */
	showModal(e) {
		if(e.currentTarget.dataset.target == 'successModal') {
			var successM = this.selectComponent("#successModal");
			successM.setInfo('lottery','',this.data.DownPoint);
			successM.show();
		} else {
			this.setData({
				modalName: e.currentTarget.dataset.target,
				modalIndex: e.currentTarget.dataset.index,
			})
		}
	},
	/**
     * 隐藏弹框
     */
	hideModal(e) {
		this.setData({
			modalName: null,
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
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
		//调用刷新时将执行的方法
    	this.onRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log(222)
        var that = this;
        var endloading = that.data.endloading
        if (!endloading){
            that.reviewpage(false)  //页面上拉调用这个方法
        }
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    }
  })
// pages/signIn/integralRecord/integralRecord.js
const api = require('../../../utils/api.js') //公用方法
const util = require('../../../utils/util.js') //公用方法
Page({
	data: {
		signRecordData: [], //积分记录数据
		page: 0,
        page_size: 10,
        cardLength: null, //数据是否为空
        isShowLoadmore:false, //正在加载 
        isShowNoDatasTips:false, //暂无数据
        endloading: false, //判断是否还有数据
	},
	// 数据懒加载 - 获取积分记录
    reviewpage: function(e){
        var that = this;
        var page = this.data.page;
		const dataParams = JSON.stringify({
            Wchat: wx.getStorageSync('openId'),
            Start: that.data.page,
            Num: that.data.page_size,
        });
		api.GetPointSignRecord(dataParams,function (res) {
            if(res.code == 10000) {
				var datas = res.data.Result;
				for(var i in datas) {
					datas[i].t = util.formatTime(new Date(datas[i].Time*1000))
				}
				that.setData({
					signRecordData: that.data.signRecordData.concat(datas)
				})
				console.log('积分记录',that.data.signRecordData)
				if (datas.length < that.data.page_size){
					console.log('已经加载完了')
					that.setData({
						isShowLoadmore: true, //隐藏正在加载
						isShowNoDatasTips: true, //显示暂无数据
						endloading: true, //上拉不在加载
					})
				}
				if (that.data.page == 0) {
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
                that.setData({
                    cardLength: true
                })
            }
		},function (err) {})
    },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.reviewpage()
		let ss = util.formatTime(new Date(1593332398783))
		console.log('ss',ss)
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
		var that = this;
        var endloading = that.data.endloading
        if (!endloading){
            that.reviewpage()  //页面上拉调用这个方法
        }
	},
})
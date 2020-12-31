const api =  require('../../../utils/api.js')
const util =  require('../../../utils/util.js')
Page({
    data: {
        TabCur: 0,
        scrollLeft:0,
        cardData: [],
        page: 0,
        page_size: 10,
        cardLength: null, //数据是否为空
        isShowLoadmore:false, //正在加载 
        isShowNoDatasTips:false, //是否加载到底部
        endloading: false, //判断是否还有数据
    },
    onLoad: function (options) {
        this.reviewpage()
    },
    // 数据懒加载 - 商品兑换记录
    reviewpage: function(e){
        var that = this;
        var page = this.data.page;
		const dataParams = JSON.stringify({
            Wchat: wx.getStorageSync('openId'),
            Start: that.data.page,
            Num: that.data.page_size,
        });
        console.log('订单参数',dataParams)
		api.GetPointForRecord(dataParams,function (res) {
			console.log('订单',res)
            if(res.code == 10000) {
                var datas = res.data.Result;
                that.setData({
                    cardData: that.data.cardData.concat(datas)  //将得到的评论添加到cardData 中 更新
                })
                if (datas.length < that.data.page_size){ //如果剩下评论数 小于10表示数据加载完了
                    console.log('已经加载完了')
                    that.setData({
                        isShowLoadmore: true, //隐藏正在加载
                        isShowNoDatasTips: true, //显示暂无数据
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
                that.setData({
                    cardLength: true
                })
            }
		},function (err) {})
    },
	tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
			scrollLeft: (e.currentTarget.dataset.id-1)*60
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
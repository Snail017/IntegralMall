// component/successModal/successModal.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        showName: 'signin',
        Status: '',
        SignPoint: '', //签到积分
        lotteryPoint: 0, //积分抽奖获得的积分
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 更新信息
        setInfo: function(name,Status,point) {
            console.log(444,name,Status,point)
            this.setData({
                showName: name,
                Status: Status,
                SignPoint: point,
                lotteryPoint: point
            });
            console.log('this.data.Status11',this.data.Status)
        },
        // 显示弹框
        show: function() {
            this.setData({
                modalName: 'successModal'
            });
        },
        // 隐藏弹框
        hideModal(e) {
            this.setData({
                modalName: null,
            })
            if(this.data.showName=='confirm') {
                wx.navigateTo({
                    url: '../myOrders/myOrders'
                })
            }
        },
    }
})

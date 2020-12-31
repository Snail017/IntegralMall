// component/empowerModal/empowerModal.js
//获取应用实例
const app = getApp()
const util =  require('../../utils/util.js')
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
        userInfo: {},
		hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        warrant: false,
        modalName: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 授权弹框显示
        show: function() {
            this.setData({
                warrant: true
            });
        },
        // 隐藏弹框
        hideModal(e) {
            this.setData({
                modalName: null,
            })
        },
        // 点击微信授权
        bins() {
            this.setData({
                warrant: false
            })
            console.log(this.data.warrant)
        },
        // 授权
        bindgetuserinfo: function (e) {
            var _this = this
            console.log(444,e)
            //用户按了允许授权按钮
            if (e.detail.userInfo) {
                // 获取到用户的信息了，打印到控制台上看下
                console.log("用户的信息如下：", e.detail.userInfo);
                //授权成功后,通过改变 hasUserInfo 的值，让实现页面显示出来，把授权页面隐藏起来
                wx.setStorageSync("nickName", e.detail.userInfo.nickName);
                wx.setStorageSync("avatarUrl", e.detail.userInfo.avatarUrl);
                wx.setStorageSync("getUserInfo", e.detail);
                app.globalData.userInfo = e.detail.userInfo
                this.setData({
                    userInfo: e.detail.userInfo,
                    hasUserInfo: true,
                    warrant: false,
                    modalName: 'successModal'
                })
                this.triggerEvent('empevent', {hasUserInfo:true,canIUse:this.data.canIUse});
                //如果缓存中没有unionid 则获取unionid
                if (!util.getStorageUnionid()) { 
                    console.log(88888888)
                    util.getUnionid(); //获取用户unionid
                }
            } else {
                //用户按了拒绝按钮
                wx.showModal({
                    title: '提示',
                    content: '您点击了拒绝授权，部分功能将无法使用，请先授权!!!',
                    showCancel: false,
                    confirmText: '返回授权',
                    success: function (e) {
                        // 用户没有授权成功
                        if (e.confirm) {
                            console.log('用户点击了“返回授权”');
                            _this.setData({
                                warrant: true
                            })
                        }
                    }
                });
            }
        },
        // 取消授权
        hideWarrant() {
            this.setData({
                warrant: false
            })
        },
    }
})

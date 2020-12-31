const baseUrl = "https://api.cellgift.cn/"  //正式网
// const baseUrl = "https://apitest.cellgift.cn/" // 测试环境
// const baseUrl = "http://192.168.1.152:8200" //游煜辉

const md5 = require('./md5.js') //MD5加密
const util =  require('./util.js')

// 获取用户openId
function GetOpenidByCode(params, onSuccess, onFailed) {
	request('/GetOpenidByCode', params, "GET", onSuccess, onFailed);
}
// 获取用户unionId
function GetOpenidByCode1(params, onSuccess, onFailed) {
	request('/GetOpenidByCode1', params, "GET", onSuccess, onFailed);
}
// 获取所有可兑换商品信息
function GetAllGoodsList(params, onSuccess, onFailed) {
	request('/GetAllGoodsList', params, "GET", onSuccess, onFailed);
}
// 兑换商品 
function getPointsFor(params, onSuccess, onFailed) {
	request('/PointsFor', params, "GET", onSuccess, onFailed);
}
// 获取商品兑换记录
function GetPointForRecord(params, onSuccess, onFailed) {
	request('/GetPointForRecord', params, "GET", onSuccess, onFailed);
}
// 获取积分
function GetSignPoint(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
	request('/GetSignPoint', dataParams, "GET",  onSuccess, onFailed)
}

// 获取积分签到记录 
function GetPointSignRecord(params, onSuccess, onFailed) {
	request('/GetPointSignRecord', params, "GET", onSuccess, onFailed);
}
//查询是否签到
function getIsSign(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
	request('/IsSign', dataParams, "GET", onSuccess, onFailed);
}
// 积分签到
function getInSign(params, onSuccess, onFailed) {
  request('/InSign', params, "GET", onSuccess, onFailed);
}
//积分抽奖
function PrizeDraw(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
  	request('/PrizeDraw', dataParams, "GET", onSuccess, onFailed);
}
//抽奖记录
function GetPrizeRecord(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
  	request('/GetPrizeRecord', dataParams, "GET", onSuccess, onFailed);
}
//总消耗积分和奖励积分
function GetTodayPoint(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
  	request('/GetTodayPoint', dataParams, "GET", onSuccess, onFailed);
} 
//获取抽奖次数
function GetPrizeTimes(params, onSuccess, onFailed) {
  request('/GetPrizeTimes', params, "GET", onSuccess, onFailed);
} 
// 获取增加次数
function AddPrizeTimes(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
  	request('/AddPrizeTimes', dataParams, "GET", onSuccess, onFailed);
}
// 个人信息保存
function SavePersonal(params, onSuccess, onFailed) {
	request('/SavePersonal', params, "GET", onSuccess, onFailed);
}
// 获取个人信息
function GetPersonal(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
	request('/GetPersonal', dataParams, "GET", onSuccess, onFailed);
} 
// 获取分享次数
function GetShareTimes(onSuccess, onFailed) {
	const dataParams = JSON.stringify({
		Wchat: wx.getStorageSync('openId')
	});
	request('/GetShareTimes', dataParams, "GET", onSuccess, onFailed);
}
// 获取抽奖参数 - 积分抽奖
function GetDrawParam(params, onSuccess, onFailed) {
	request('/GetDrawParam', params, "GET", onSuccess, onFailed);
}
// 抽奖 - 积分抽奖
function PointDraw(params, onSuccess, onFailed) {
	request('/PointDraw', params, "GET", onSuccess, onFailed);
}
// 中奖展示列表 - 积分抽奖
function RankDrawRecordList(params, onSuccess, onFailed) {
	request('/RankDrawRecordList', params, "GET", onSuccess, onFailed);
}
// 获取新用户福利
function GetUserWelfare(params, onSuccess, onFailed) {
	request('/GetUserWelfare', params, "GET", onSuccess, onFailed);
}
// 获取首页banner
function GetBanner(onSuccess, onFailed) {
	request('/GetBanner', '', "GET", onSuccess, onFailed);
}
// 获取首页eCell兑换数量
function GetMinECellTrade(onSuccess, onFailed) {
	request('/GetMinECellTrade', '', "GET", onSuccess, onFailed);
}

/**
 * 请求头
 */
var header = {
	// 'content-type': 'application/x-www-form-urlencoded',
	'Content-Type': 'application/json', //告诉服务器，我们提交的数据类型
}
/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
	return {
		data: params,
		syn: md5(`${params}X9dsf_)#&334$R(`)
	}
}
/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST/PUT
 * @onSuccess 成功回调
 * @onFailed  失败回调 
 */
  
function request(url, params, method, onSuccess, onFailed) {
	showLoading("数据请求中...");
	wx.request({
		url: baseUrl + url,
		data: dealParams(params),
		method: method,
		credentials: 'include',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		header: {
			openid: wx.getStorageSync("openid"),
			'Content-Type': 'text/plain;charset=utf-8',
		},
		success: function(res) {
			hideLoading();
			if (res.data) {
			/** start 根据需求 接口的返回状态码进行处理 */
			if (res.statusCode == 200) {
				onSuccess(res.data); //request success
			} else {
				onFailed(res.data.message); //request failed
			}
			/** end 处理结束*/
			}
		},
		fail: function(error) {
			hideLoading();
			onFailed(""); //failure for other reasons
			console.log("请求失败!")
		}
	})
}


function showLoading(message) {
	if (wx.showLoading) {
		// 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
		wx.showLoading({
			title: message,
			mask: true
		});
	} else {
		// 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
		wx.showToast({
			title: message,
			icon: 'loading',
			mask: true,
			duration: 20000
		});
	}
}
function hideLoading() {
	if (wx.hideLoading) {
		// 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
		wx.hideLoading();
	} else {
		wx.hideToast();
	}
}
// 防止重复点击
function isClicked(self) {
	self.setData({
		isClicked: true
	})
	setTimeout(function () {
		self.setData({
			isClicked: false
		})
	}, 2000)
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
	GetOpenidByCode,
	GetOpenidByCode1,
	GetAllGoodsList,
	getPointsFor,
	GetPointForRecord,
	GetSignPoint,
	GetPointSignRecord,
	getIsSign: getIsSign,
	getInSign: getInSign,
	baseUrl: baseUrl,
	PrizeDraw:PrizeDraw,
	GetPrizeRecord :GetPrizeRecord ,
	GetTodayPoint:GetTodayPoint,
	AddPrizeTimes:AddPrizeTimes,
	GetPrizeTimes:GetPrizeTimes,
	SavePersonal:SavePersonal,
	GetPersonal:GetPersonal,
	GetShareTimes: GetShareTimes,
	GetDrawParam: GetDrawParam,
	PointDraw: PointDraw,
	RankDrawRecordList: RankDrawRecordList,
	GetUserWelfare: GetUserWelfare,
	GetBanner: GetBanner,
	GetMinECellTrade: GetMinECellTrade,
	isClicked: isClicked,
}
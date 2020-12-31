const api = require('api.js') //接口请求方法
//获取缓存中的用户 openid
function getStorageOpenid() {
	return wx.getStorageSync("openId")
}
//获取缓存中的用户 unionid
function getStorageUnionid() {
  return wx.getStorageSync("unionid")
}
//获取用户 openid
function getOpenid() {
	return new Promise((resolve, reject) => {
		wx.login({
			success: res => {
				console.log('登录',res)
				wx.setStorageSync('code', res.code)
				// 发送 res.code 到后台换取 openId, sessionKey
				const dataParams = JSON.stringify({
					Code: res.code,
				});
				api.GetOpenidByCode(dataParams,function (res) {
					console.log(77777777)
					wx.setStorageSync('openId', res.data.openid)
					wx.setStorageSync('unionid', res.data.unionid)
					console.log('openid',res.data.openid)
					
					if(res.code==-10003) {
						if(wx.getStorageSync("getUserInfo")) {
							getUnionid();
						}
					}
					resolve(res.data)
				},function (err) {
					reject('error')
				})
			}
		})
	})
}
//获取用户 unionid
function getUnionid() {
	return new Promise((resolve, reject) => {
		const dataParams = JSON.stringify({
			// Code: res.code,
			openid: wx.getStorageSync("openId"),
			rawData: wx.getStorageSync("getUserInfo").rawData,
			signature: wx.getStorageSync("getUserInfo").signature,
			EncryptedData: wx.getStorageSync("getUserInfo").encryptedData,
			Iv: wx.getStorageSync("getUserInfo").iv,
		});
		api.GetOpenidByCode1(dataParams,function (res) {
			console.log(88888888)
			wx.setStorageSync('unionid', res.data.unionid)
			resolve(res.data)
		},function (err) {
			reject('error')
		})
	})
}
// 公用toast提示方法
function showToast(msg, label) {
	if (msg) {
		if (label == undefined) {
			label = 'none';
		} else if (label == 'success') {
			wx.showToast({
				title: msg,
				icon: 'success',
				duration: 2000
			})
		} else if (label == 'loading') {
			wx.showToast({
				title: msg,
				icon: 'loading',
				duration: 2000
			})
		} else if (label == 'fail') {
			wx.showToast({
				title: msg,
				icon: 'none',
				duration: 4000
			})
		} else {
			wx.showToast({
				title: msg,
				icon: 'none',
				duration: 2000
			})
		}
	}
}

const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
//最近一周 getDay(-7)    返回的是距离当前日期的一周后的时间
//一月 getDay(-30)
//一年 getDay(-365)
function getDay(day) {

	var today = new Date();

	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

	today.setTime(targetday_milliseconds); //注意，这行是关键代码

	var tYear = today.getFullYear();

	var tMonth = today.getMonth();

	var tDate = today.getDate();

	tMonth = doHandleMonth(tMonth + 1);

	tDate = doHandleMonth(tDate);

	return tYear + "-" + tMonth + "-" + tDate;
}

function doHandleMonth(month) {
	var m = month;
	if (month.toString().length == 1) {
		m = "0" + month;
	}
	return m;
}

//三位加逗号
const changeNum = function toThousands(num) {
	var result = [],
		counter = 0;
	num = (num || 0).toString().split('');
	for (var i = num.length - 1; i >= 0; i--) {
		counter++;
		result.unshift(num[i]);
		if (!(counter % 3) && i != 0) {
		result.unshift(',');
		}
	}
	return result.join('');
}

// 中文转化utf-8
function encodeUTF8(str) {
	return str.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
}
// utf-8转换中文
function decodeUTF8(str) {
	return unescape(str.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
}

module.exports = {
  formatTime: formatTime,
  getOpenid: getOpenid,
  getUnionid: getUnionid,
  getStorageOpenid: getStorageOpenid,
  getStorageUnionid: getStorageUnionid,
  showToast: showToast,
  getDay: getDay,
  changeNum: changeNum,
  encodeUTF8: encodeUTF8,
  decodeUTF8: decodeUTF8
}
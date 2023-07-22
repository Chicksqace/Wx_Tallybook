var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data:{
    dateTimeArray: null,
    dateTime: null,
    startYear: 2010, //开始年份
    endYear: 2050,  //结束年份
    accountId:null, //账户id
    tradeDate:null, //交易日期
    totalBalance:0 //总金额
  },
  onLoad:function(e){
    var accountId = e.accountId;
    console.log(accountId);
    this.setData({
      accountId:accountId
    });
    this.initDate();//初始化日期
    this.loadAccount(accountId);//加载账户信息
  },
  initDate:function(){//初始化日期
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    //精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();//[2020,4,1,2,30,30]
    //初始化当天交易日期
    var tradeDate = obj.dateTimeArray[0][obj.dateTime[0]] + "-" + obj.dateTimeArray[1][obj.dateTime[1]] + "-" + obj.dateTimeArray[2][obj.dateTime[2]] + " " + obj.dateTimeArray[3][obj.dateTime[3]] + ":" + obj.dateTimeArray[4][obj.dateTime[4]];
    this.setData({
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime,
      tradeDate: tradeDate
    });
  },
  changeDateTime(e) {//选择交易日期时重新设值
    var dateTimeArray = this.data.dateTimeArray;
    var dateTime = e.detail.value;
    //交易日期
    var tradeDate = dateTimeArray[0][dateTime[0]] + "-" + dateTimeArray[1][dateTime[1]] + "-" + dateTimeArray[2][dateTime[2]] + " " + dateTimeArray[3][dateTime[3]] + ":" + dateTimeArray[4][dateTime[4]];
    console.log(tradeDate);
    this.setData({ 
      dateTime: e.detail.value,
      tradeDate:tradeDate 
    });
  },
  formSubmit: function (e) {//记录交易明细
    var that = this;
    var type = e.detail.value.type; //交易类型
    var balance = e.detail.value.balance; //交易金额
    var remark = e.detail.value.remark; //备注

    //计算操作后余额
    var totalBalance = parseFloat(that.data.totalBalance);
    if (type == 0) {
      totalBalance = totalBalance + parseFloat(balance);
    } else {
      totalBalance = totalBalance - parseFloat(balance);
    }

    wx.cloud.callFunction({ // 调用云函数  
      name: 'saveAccountDetail',
      data: {
        type: type,
        balance: balance,
        remark: remark,
        accountId: that.data.accountId,
        tradeDate: that.data.tradeDate,
        totalBalance: totalBalance
      },
      success: res => {
        console.log('[云函数] [saveAccountDetail] 记录交易明细: ', res);
        var errMsg = res.result.errMsg;
        if (errMsg == "collection.add:ok") {
          that.updateAccount(that.data.accountId,totalBalance);
        }
      },
      fail: err => {
        console.error('[云函数] [saveAccountDetail] 记录交易明细', err);
      }
    })
  },
  loadAccount:function(accountId){//根据账户id加载账户信息
    var that = this;
    wx.cloud.callFunction({ // 调用云函数  
      name: 'loadAccount',
      data: {
        accountId: accountId
      },
      success: res => {
        console.log('[云函数] [loadAccount] 加载账户信息: ', res);
        var obj = res.result.data[0];
        that.setData({
          totalBalance:obj.balance
        });
      },
      fail: err => {
        console.error('[云函数] [loadAccount] 加载账户信息', err);
      }
    })
  },
  updateAccount: function (accountId, totalBalance){//更新账号余额
    wx.cloud.callFunction({ // 调用云函数  
      name: 'updateAccount',
      data: {
        accountId: accountId,
        totalBalance: totalBalance
      },
      success: res => {
        console.log('[云函数] [updateAccount] 更新账号余额: ', res);
        var errMsg = res.result.errMsg;
        if (errMsg == "document.update:ok") {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              //返回上一页面
              wx.navigateBack({
                delta: 2
              })
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [updateAccount] 更新账号余额', err);
      }
    })
  }
})
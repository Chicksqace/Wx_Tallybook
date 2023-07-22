Page({
  data:{
    balance:0, //账户总余额
    id:null, //账户id 
    accountDetails:[] //账户明细列表
  },
  onLoad:function(e){
    console.log(e);
    var id = e.id; //账户id
    var balance = e.balance; //账户金额
    this.setData({
      balance:balance,
      id:id
    });
    this.loadAccountDetail(id);
  },
  writeOne:function(){//记一笔跳转路径，传递账户id参数
    var that = this;
    wx.navigateTo({
      url: '../writeOne/writeOne?accountId='+that.data.id,
    })
  },
  loadAccountDetail: function (accountId) {//加载交易明细
    var that = this;
    wx.cloud.callFunction({ // 调用云函数  
      name: 'loadAccountDetail',
      data: {
        accountId: accountId  //账户id
      },
      success: res => {
        console.log('[云函数] [loadAccountDetail] 加载交易明细: ', res);
        var result = res.result.data;
        that.setData({
          accountDetails: result
        });
      },
      fail: err => {
        console.error('[云函数] [loadAccountDetail] 加载交易明细', err);
      }
    })
  }
})
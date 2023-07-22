var app = getApp();
// 初始化云开发
wx.cloud.init({
  env: 'test'
});
//初始化数据库
const db = wx.cloud.database();
Page({
  data: {
    openid: null,
    accounts:[],
    count:0,
    total:0
  },
  onShow: function() {
    this.getOpenid();
  },
  add: function() {//添加账户跳转
    wx.navigateTo({
      url: '../createAccount/createAccount',
    })
  },
  seeDetail: function(e) {//查看账户明细跳转，传递账户id、余额参数
    var id = e.target.dataset.id;
    var balance = e.target.dataset.balance;
    wx.navigateTo({
      url: '../accountDetail/accountDetail?id='+id+'&balance='+balance,
    })
  },
  loadAccount: function(openid) {//根据openid来加载账户信息
    var that = this;
    db.collection('account').where({
      _openid: openid // 填入当前用户 openid
    }).orderBy('createTime', 'desc').get().then(res => {
      console.log("获取账户信息="+res);
      var accounts = res.data;
      var total = 0;
      for(var i=0;i<accounts.length;i++){
        total += parseFloat(accounts[i].balance);
      }
      that.setData({
        accounts: accounts,
        count: accounts.length,
        total:total
      });
    });
  },
  getOpenid: function() { //获取openid
    var that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        const openid = res.result.openid
        this.setData({
          "openid": openid
        });
        that.loadAccount(openid);
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})
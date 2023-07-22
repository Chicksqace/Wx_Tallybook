Page({
  data: {
    types: [
      {
        "id": "0",
        "icon": "/images/account/xj.jpg",
        "typeName": "现金"
      },
      {
        "id": "1",
        "icon": "/images/account/zfb.jpg",
        "typeName": "支付宝"
      },
      {
        "id": "2",
        "icon": "/images/account/wx.jpg",
        "typeName": "微信"
      }
    ]
  },
  formSubmit: function (e) {//创建账户
    var id = e.detail.value.id; //账户类型id
    var name = e.detail.value.name; //账户名称
    var balance = e.detail.value.balance; //账户余额
    var remark = e.detail.value.remark; //账户备注
    var type = this.data.types[id]; //账本类型对象
    wx.cloud.callFunction({ // 调用云函数  
      name: 'saveAccount',
      data: {
        typeId: id,
        typeName: type.name,
        name: name,
        icon: type.icon,
        balance: balance,
        remark: remark
      },
      success: res => {
        console.log('[云函数] [saveAccount] 创建账户: ', res);
        var errMsg = res.result.errMsg;
        if (errMsg == "collection.add:ok") {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [saveAccount] 创建账户', err);
      }
    })
  }
})
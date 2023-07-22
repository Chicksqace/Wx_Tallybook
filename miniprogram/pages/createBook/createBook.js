Page({
  data:{
    types: [
      {
        "id":"0",
        "icon": "/images/book/rc.jpg",
        "typeName": "日常"
      },
      {
        "id": "1",
        "icon": "/images/book/sy.jpg",
        "typeName": "生意"
      },
      {
        "id": "2",
        "icon": "/images/book/jt.jpg",
        "typeName": "家庭"
      },
      {
        "id": "3",
        "icon": "/images/book/lx.jpg",
        "typeName": "旅行"
      },
      {
        "id": "4",
        "icon": "/images/book/zx.jpg",
        "typeName": "装修"
      },
      {
        "id": "5",
        "icon": "/images/book/jh.jpg",
        "typeName": "结婚"
      },
      {
        "id": "6",
        "icon": "/images/book/xy.jpg",
        "typeName": "校园"
      },
      {
        "id": "7",
        "icon": "/images/book/bf.jpg",
        "typeName": "班费"
      }
    ]
  },
  formSubmit:function(e){//创建账本
    var id = e.detail.value.id; //账本类型id
    var name = e.detail.value.name; //账本名称
    var type = this.data.types[id]; //账本类型对象
    wx.cloud.callFunction({ // 调用云函数  
      name: 'saveBook',
      data:{
        typeId: id, 
        typeName: type.typeName,
        name: name,
        icon: type.icon
      },
      success: res => {
        console.log('[云函数] [saveBook] 创建记账本: ', res);
        var errMsg = res.result.errMsg;
        if (errMsg == "collection.add:ok"){
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
        console.error('[云函数] [saveBook] 创建记账本', err);
      }
    })
  }
})
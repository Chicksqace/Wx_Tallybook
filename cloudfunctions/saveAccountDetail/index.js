// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var result = await db.collection('accountDetail').add({
    data: {
      type: event.type,
      balance: event.balance,
      remark: event.remark,
      accountId: event.accountId,
      tradeDate: event.tradeDate,
      totalBalance: event.totalBalance,
      createTime: new Date(),
      updateTime: new Date(),
      _openid: wxContext.OPENID
    }
  });
  return result;
}
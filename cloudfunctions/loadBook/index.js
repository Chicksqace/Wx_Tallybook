// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var pageIndex = event.pageIndex;
  var pageSize = event.pageSize;
  var result = await db.collection('accountBook').where({
    _openid: wxContext.OPENID // 填入当前用户 openid
  }).skip(pageIndex).limit(pageSize).orderBy('createTime', 'desc').get();
  return result;
}
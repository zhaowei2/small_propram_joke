// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('discuss_tbl').add({
    data: {
      discussId: event.data.discussId,
      avatar: event.data.avatar,
      nickName: event.data.nickName,
      discussContent: event.data.discussContent,
      openId: '',
      time: event.data.time
    },
  }).then(res => {
    return res
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
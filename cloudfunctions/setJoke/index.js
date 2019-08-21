// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.type === 'image'){
    return await db.collection('joke_pic_tbl').doc(event.data.id).update({
      data: {
        discuss:event.data.num 
      },
    }).then(res => {
      return res
    })
  }else{
    return await db.collection('joke_tbl').doc(event.data.id).update({
      data: {
        discuss: event.data.num
      },
    }).then(res => {
      return res
    })
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
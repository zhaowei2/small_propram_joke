// miniprogram/pages/storyDetail/storyDetail.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    discussList: [],
    discussVlaue: '',
    avatarUrl: '',
    userInfo: {},
    item: {}
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.setData({
      item: app.globalData
    })
    wx.setNavigationBarTitle({
      title: '评论',
    })
    this.getDiscuss()
    var that = this
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //           that.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  bindTextInputBlur: function (e) {
    let dataset = e.currentTarget.dataset
    this.setData({
      discussVlaue: e.detail.value
    })
  },
  postDiscuss: function () {
    var discussVlaue = this.data.discussVlaue
    if (!discussVlaue) {
      wx.showToast({
        title: '评论内容不能为空',
      })
    }
    var that = this
    const db = wx.cloud.database()
    let _time = new Date().getTime();
    let item = {
      discussId: this.data.item.item._id,
      avatar: '',
      nickName: '',
      discussContent: discussVlaue,
      poenId: '',
      time: _time
    }
    console.log(item)
    wx.cloud.callFunction({
      name: 'sicussPost',
      data: {
        type: 'addDiscuss',
        data: item
      }
    }).then(res=>{
      console.log(res)
      that.setData({
        discussVlaue: ''
      })
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      that.getDiscuss()
    })
  },
  getDiscuss: function () {
    const db = wx.cloud.database()
    const that = this
    db.collection('discuss_tbl').where({
      discussId: that.data.item.item._id,
    }).get({
      success: res => {
        console.log(res)
        // 在返回结果中会包含新创建的记录的 _id
        that.setData({
          discussList: res.data
        })
        that.setCounter(res.data.length)
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  setCounter(num) {
    if(num>0){
      const db = wx.cloud.database();
      const that = this;
      let item = {
        id: that.data.item.item._id,
        num: num
      }
      wx.cloud.callFunction({
        name: 'setJoke',
        data: {
          type: that.data.item.item.type,
          data: item
        }
      }).then(res => {
        console.log(res)
        
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      })
    }
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
// miniprogram/pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize:16,
    textPageNum: 0,
    picPageNum:0,
    isText:true,
    textBaseData:[],
    picBaseData:[],
    textTotal:0,
    picTotal:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initJoke()
    this.initJokePic()
  },
  previewImg(e){
    let src = e.currentTarget.dataset['src'];
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  // 切换选项卡
  onClickChangeTab(e){
    let index = e.currentTarget.dataset['index'];
    if(index === '1'){
      this.setData({
        isText: true
      })
    }else{
      this.setData({
        isText: false
      })
    }
  },
  // 点赞
  handStoryPraise(e){
    let type = e.currentTarget.dataset['type'];
    let item = e.currentTarget.dataset['item'];
    let index = e.currentTarget.dataset['index'];
    let that = this;
    wx.cloud.callFunction({
      name: 'pic-operation',
      data: {
        type: 'praise',
        data: item
      }
    }).then(res => {
      // 图片
      if (type === 'image') {
        let picBaseData = that.data.picBaseData;
        let praiseNum = picBaseData[index].praise + 1
        let praise = 'picBaseData[' + index + '].praise';
        if (res.result.stats.updated == 1) {
          that.setData({
            [praise]: praiseNum
          })
        } else {
          wx.showToast({
            title: '获取basedata数据失败',
          })
        }
      // 笑话 
      } else {
        let textBaseData = that.data.textBaseData;
        let praiseNum = textBaseData[index].praise + 1
        let praise = 'textBaseData[' + index + '].praise';
        if (res.result.stats.updated == 1) {
          that.setData({
            [praise]: praiseNum
          })
        } else {
          wx.showToast({
            title: '获取basedata数据失败',
          })
        }
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '获取数据失败',
      })
    })
  },
  // 踩
  handStoryPeak(e){
    let type = e.currentTarget.dataset['type'];
    let item = e.currentTarget.dataset['item'];
    let index = e.currentTarget.dataset['index'];
    let that = this;
    wx.cloud.callFunction({
      name: 'pic-operation',
      data: {
        type: 'peak',
        data: item
      }
    }).then(res => {
      // 图片
      if (type === 'image') {
        let picBaseData = that.data.picBaseData;
        let peakNum = picBaseData[index].peak + 1
        let peak = 'picBaseData[' + index + '].peak';
        if (res.result.stats.updated == 1) {
          that.setData({
            [peak]: peakNum
          })
        } else {
          wx.showToast({
            title: '获取basedata数据失败',
          })
        }
        // 笑话 
      } else {
        let textBaseData = that.data.textBaseData;
        let peakNum = textBaseData[index].peak + 1
        let peak = 'textBaseData[' + index + '].peak';
        if (res.result.stats.updated == 1) {
          that.setData({
            [peak]: peakNum
          })
        } else {
          wx.showToast({
            title: '获取basedata数据失败',
          })
        }
      }

    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '获取数据失败',
      })
    })
  },
  // 评论
  handStoryDetial: function (e) {
    let item = e.currentTarget.dataset['item'];
    let index = e.currentTarget.dataset['index'];
    app.globalData.item = item;
    app.globalData.index = index;
    wx.navigateTo({
      url: '../storyDetail/storyDetail',
    })
  },
  // 获取评论数量
  getDiscussCounts() {
    let item = app.globalData.item;
    let index = app.globalData.index;
    if (item === undefined) {
      return false
    }
    if (index === undefined) {
      return false
    }
    let that = this;
    wx.cloud.callFunction({
      name: 'pic-operation',
      data: {
        type: 'discuss',
        data: item
      }
    }).then(res => {
      console.log(res)
      if (res.result.data) {
        console.log(item)
        if(item.type==='image'){
          let picBaseData = that.data.picBaseData;
          let praiseNum = res.result.data.length;
          let discuss = 'picBaseData[' + index + '].discuss';
          console.log(discuss)
          that.setData({
            [discuss]: praiseNum
          })
        }else{
          let textBaseData = that.data.textBaseData;
          let praiseNum = res.result.data.length;
          let discuss = 'textBaseData[' + index + '].discuss';
          that.setData({
            [discuss]: praiseNum
          })
        }
  
      }
    }).catch(console.err)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 初始笑话
  initJoke:function(){
    const db = wx.cloud.database();
    const MAX_LIMIT = this.data.pageSize;
    const that = this;
    let skipNum = this.data.textPageNum * MAX_LIMIT
    // 文本
    if (skipNum) {
      db.collection('joke_tbl').skip(skipNum).limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then(res => {
        let pageNum = that.data.textPageNum + 1
        that.setData({
          textPageNum: pageNum,
          textBaseData: [...that.data.textBaseData, ...res.data]
        })
      })
    } else {
      db.collection('joke_tbl').limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then(res => {
        console.log(res)
        let pageNum = that.data.textPageNum + 1
        that.setData({
          textPageNum: pageNum,
          textBaseData: [...that.data.textBaseData, ...res.data]
        })
      })
    }
    // 总页数
    db.collection('joke_tbl').count().then(res=>{
      console.log(res)
      this.setData({
        textTotal: res.total
      })
    })
  },
  // 初始图片
  initJokePic: function () {
    const db = wx.cloud.database();
    const MAX_LIMIT = this.data.pageSize;
    const that = this;
    let skipNum = this.data.picPageNum * MAX_LIMIT
    // 文本
    if (skipNum) {
      db.collection('joke_pic_tbl').skip(skipNum).limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then(res => {
        let pageNum = that.data.picPageNum + 1
        that.setData({
          picPageNum: pageNum,
          picBaseData: [...that.data.picBaseData, ...res.data]
        })
      })
    } else {
      db.collection('joke_pic_tbl').limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then(res => {
        console.log(res)
        let pageNum = that.data.picPageNum + 1
        that.setData({
          picPageNum: pageNum,
          picBaseData: [...that.data.picBaseData, ...res.data]
        })
      })
    }
    // 总页数
    db.collection('joke_pic_tbl').count().then(res => {
      console.log(res)
      this.setData({
        picTotal:res.total
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDiscussCounts()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.isText) {
      this.setData({
        textPageNum: 0,
        textBaseData: []
      })
      this.initJoke();
    } else {
      this.setData({
        picPageNum: 0,
        picBaseData: []
      })
      this.initJokePic();
    }
    wx.stopPullDownRefresh()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    console.log(11111111)
    if(this.data.isText){
      if ((this.data.textPageNum * this.data.pageSize) < this.data.textTotal) {
        this.initJoke()
      }
    }else{
      if ((this.data.picPageNum * this.data.pageSize) < this.data.picTotal) {
        this.initJokePic()
      }
    }

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
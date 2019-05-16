const app=getApp();
var uid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    noteMaxLen: 300, // 最多放多少字
    info: "",
    noteNowLen: 0,//备注当前字数
    eId:null,
    uId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //console.log("接收：" + options.eId)
      that.setData({
        eId: options.eId,
      })
    if (app.globalData.UId) {
      var uid = app.globalData.UId
      console.log("uid:" + uid)
      this.setData({
        uId: uid
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.uIDReadyCallback = res => {
        this.setData({
          uId: res.data.uId
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 监听字数
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({ info: value, noteNowLen: len })

  },
  // 提交清空当前值
  bindSubmit: function () {
    var that = this;
    console.log(new Date());
    wx.request({
      url: app.globalData.url + '/curation/exhibition/insert/',
      method:"POST",
      data:{
        uid:that.data.uId,
        eid:that.data.eId,
        grade:that.data.flag,
        time: new Date(),
        context:that.data.info,
        Image: null
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:res=>{
        console.log(res.data);
        
      }
    })
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1500,
      mask: false,
      success: function () {
        that.setData({ info: '', noteNowLen: 0, flag: 0 })
        
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },
  changeColor1: function () {
    var that = this;
    that.setData({
      flag: 1
    });
    //console.log("flag:" + this.data.flag)
  },
  changeColor2: function () {
    var that = this;
    that.setData({
      flag: 2
    });
    //console.log("flag:" + this.data.flag)
  },
  changeColor3: function () {
    var that = this;
    that.setData({
      flag: 3
    });
    //console.log("flag:" + this.data.flag)
  },
  changeColor4: function () {
    var that = this;
    that.setData({
      flag: 4
    });
   // console.log("flag:" + this.data.flag)
  },
  changeColor5: function () {
    var that = this;
    that.setData({
      flag: 5
    });
    //console.log("flag:" + this.data.flag)
  },
 
})
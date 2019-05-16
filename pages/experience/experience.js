// pages/experience/experience.js
const app = getApp();
var uid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre_url: app.globalData.url + '/curation',
    experienced:[

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    uid=options.uid
   // console.log("接收：" + uid)
    wx.request({
      url: app.globalData.url + '/curation/personal/experience?id=' + uid,
      success: res => {
        console.log("success:" + JSON.stringify(res))
        that.setData({
          experienced: res.data.data.Experienced
        })
        //console.log(that.data.experienced)
      },
      fail: res => {
        console.log("fail:" + JSON.stringify(res))
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  navtodetails: function (e) {

    // console.log("[eId]->"+JSON.stringify(e.currentTarget))
   // console.log("eid = " + e.currentTarget.id);
    wx.navigateTo({
      url: '../details/details?eId=' + e.currentTarget.id,
      success: res => {
        console.log("success " + JSON.stringify(res))
      },
      fail: function (res) {
        console.log("fail " + JSON.stringify(res))
      },
    })
  }
  ,
  navtoresult: function (e) {

     //console.log("[eId]->"+JSON.stringify(e.currentTarget))
     //console.log("eid = " + e.currentTarget.id);
    wx.navigateTo({
      url: '../expresult/expresult?eid=' + e.currentTarget.id+'&uid='+uid,//这里应该是结果页
      success: res => {
        console.log("success " + JSON.stringify(res))
      },
      fail: function (res) {
        console.log("fail " + JSON.stringify(res))
      },
    })
  }
})
// pages/expresult/expresult.js

var imageUtil = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
    pre_url: app.globalData.url + '/curation',
    report_path: null,
    imgalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var uid = options.uid
    var eid = options.eid
   // console.log("aaaffffffaa :" + app.globalData.url + '/curation/personal/report?uid=' + uid + '&eid=' + eid)
   // console.log("接收：" + uid)
    wx.request({
      url: app.globalData.url + '/curation/personal/report?uid=' + uid+'&eid='+eid,
      success: res => {
        //console.log("success:" + JSON.stringify(res))
        //console.log("success:" + res.data)
        that.setData({
          report_path: res.data.report_path
        })
      },
      fail: res => {
        //console.log("fail:" + JSON.stringify(res))
      },      
      })
    
    
  },


  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
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

  previewImage: function (e) {

    //console.log("fafafa: " + this.data.pre_url + this.data.report_path)
    this.data.imgalist.push(this.data.pre_url + this.data.report_path);
    //console.log("aaaa" + this.data.imgalist);

    wx.previewImage({
      current: this.data.pre_url+this.data.report_path, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })


    wx.getImageInfo({// 获取图片信息（此处可不要）
      src: this.data.pre_url + this.data.report_path,
      success: function (res) {
      //  console.log(res.width)
        //console.log(res.height)
      }
    })

  }

})
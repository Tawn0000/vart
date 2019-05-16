// pages/details/details.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infomore:false,
    pre_url: app.globalData.url + '/curation/tmp/exhibitions/',
    pre_url_description: app.globalData.url + '/curation/images/detail/',
    exhibition:{
      eId:null,
      eName:null,
      eAddress:null,
      e_Begin_Date:null,
      e_End_Date:null,
      ePrice:null,
      eDescription:null,
      eImage:null
    },
    comment:[
      {
        cId:null,
        uId:null,
        eId:null,
        cGrade:null,
        cDate:null,
        cContent:null,
        cImage:null,
      }
    ],
    longitude: 113.324520,
    latitude: 23.099994,
    markers: [{
      id: 0,
      iconPath: null,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
   // console.log("接收："+options.eId)
   // console.log("url=" + app.globalData.url + '/curation/exhibition/detail?uid=' + app.globalData.UId + '&eid=' + options.eId),
    wx.request({
      url: app.globalData.url + '/curation/exhibition/detail?uid=' + app.globalData.UId +'&eid='+options.eId,
      success:res=>{
        console.log("success:"+JSON.stringify(res))
        
        that.setData({
          exhibition: res.data.exhibition,
           comment:res.data.comment,
        })
        console.log(that.data.pre_url+that.data.exhibition.eImage)
      },
      fail:res=>{
        console.log("fail:" + JSON.stringify(res))
      }
    }),
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log(res.latitude+" " + res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
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
    if(this.data.exhibition.eId != null)
      this.showcomment()
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
  infomore:function(){
    var flag=!this.data.infomore;
    this.setData({infomore:flag});
  },


  showcomment: function (){
    var that = this
    //console.log("url=" + app.globalData.url + '/curation/exhibition/detail?uid=' + app.globalData.UId + '&eid=' + that.data.exhibition.eId),
      wx.request({
      url: app.globalData.url + '/curation/exhibition/detail?uid=' + app.globalData.UId + '&eid=' + that.data.exhibition.eId,
        success: res => {
          console.log("success:" + JSON.stringify(res))

          that.setData({
            comment: res.data.comment,
          })
          console.log(that.data.comment)
        },
        fail: res => {
          console.log("fail:" + JSON.stringify(res))
        }
      })
  },


  favorclick: function (e) {
    var likeFlag = false; //标志，避免多次发请求
    //避免多次点击
    if (likeFlag === true) {
      return false;
    }
    var that = this;
    if (e.currentTarget.dataset.userid == that.data.user_id) {
      that.Pop_show('/image/close.png', '不能给自己评论点赞');
      return
    }
    var comment_id = e.currentTarget.dataset.id; //点击当前项的id
    var index = e.currentTarget.dataset.dex;
    var islike = e.currentTarget.dataset.islike;
    var message = this.data.talks;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var zanInfo = {
      token: App.globalData.portConfig.token,
      timestamp: timestamp,
      comment_id: comment_id,
      cancel: islike,
    }
    var zanData = zanInfo;
    var postzanData = that.makePostData(zanData, that.data.key);
    wx.request({
      url: App.globalData.portConfig.HTTP_BASE_URL + '/comment/addLike', //点赞接口
      data: postzanData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        for (let i in message) {
          if (i == index) {
            if (message[i].is_like == 0) {
              that.data.talks[index].is_like = 1
              message[i].like_num = parseInt(message[i].like_num) + 1
            } else {
              that.data.talks[index].is_like = 0
              message[i].like_num = parseInt(message[i].like_num) - 1
            }
          }
        }
        that.setData({
          talks: message
        })
        console.log("点赞成功", res);

      },
      complete: function (res) {
        likeFlag = false;
      }
    })
  },
  remark:function(e){
   // console.log("aaaa"+this.data.exhibition.eId)
    wx.navigateTo({
      url: '../comment/comment?eId='+this.data.exhibition.eId,
    })
  }
})
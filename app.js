//app.js

App({
  globalData: {
    userInfo: null,
    UId: null,
    portconfig: {},
    //url:  'http://localhost:8082',
    //url:'https://www.zhouchen1998.xyz:8082',
    //url: 'http://122.152.204.226:8082'
    url: 'https://shop.leju315.com:8082'
  },
  onLaunch: function () {//onLaunch 生命周期函数--监听小程序初始化（全局触发一次）
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('App Launch')
    // 登录
    wx.login({
      success: res => {
        
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          console.log("登陆成功"+res.code);

          wx.request({
            url: this.globalData.url + '/curation/wx/auth/login',
            data:{
              code:res.code
            },
            success:res=>{
              this.globalData.UId=res.data.uId
              if (this.uIDReadyCallback){
                this.uIDReadyCallback(res)
              }
            }
          })
        }else{
          console.log('登陆失败'+res.errMsg)
        }
      },
      fail:res=>{
        console.log("失败")
      }
    })
    // console.log()
    //获取openid
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
               
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // console.log("UID:" + UId)
  }
})
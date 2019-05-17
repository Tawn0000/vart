//index.js
//获取应用实例
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    flag: 0,
    cur_eid: null,
    province: '',
    city: '',
    latitude: '',
    longtitude: '',
    time: (new Date()).toString(),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pre_url: app.globalData.url + '/curation',
    item: [{
      eId: null,
      eName: null,
      eAddress: null,
      eDate: null,
      eImage: null,
      eDescription: null,
      ePrice: null,
    }],
    uuids: [
      '01122334-4556-6778-899a-abbccddeeff1',
      '01122334-4556-6778-899a-abbccddeeff2',
      '01122334-4556-6778-899a-abbccddeeff3',
      '01122334-4556-6778-899a-abbccddeeff4',
      '01122334-4556-6778-899a-abbccddeeff5',
      '01122334-4556-6778-899a-abbccddeeff6',
      '01122334-4556-6778-899a-abbccddeeff7',
      '01122334-4556-6778-899a-abbccddeeff8',
      '01122334-4556-6778-899a-abbccddeeff9',
      '01122334-4556-6778-899a-abbccddeef10',
    ],
    user_area_uuid: '',
    user_state: '',
    start_time: null,
    end_time: null,
    user_close_distance: Infinity,
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    qqmapsdk = new QQMapWX({
      key: 'I37BZ-MF7A3-I6L3W-3O3RJ-C6BVS-7GBRU'
    });
    wx.request({
      url: app.globalData.url + '/curation/exhibition/queryByAddress',
      data: {
        address: that.data.province || "江苏"
      },
      success: res => {
        var exhibition = res.data.exhibitionTokenList
        that.setData({
          item: exhibition
        })
      },
      fail: res => {
        console.log("请求失败")
      }
    })
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onstart: function (e) {
    var that = this;
    console.log("onstart");
    if (that.data.flag == 0) {
      
      if (that.data.flag == 0) {
        
        //请求打开蓝牙
        //
        wx.openBluetoothAdapter({
          
          success: function (res) {
            that.setData({
              flag: 1,
              cur_eid: e.currentTarget.id
            });
            console.log("获得蓝牙权限")
            wx.startBeaconDiscovery({
              uuids: that.data.uuids,
              success: function () {
                console.log("开始扫描设备...");
                // 监听iBeacon信号  
                wx.onBeaconUpdate(function (res) {

                  // 如果有设备监听到
                  if (res && res.beacons && res.beacons.length > 0) {
                    var array_uuid = new Array();
                    var array_distance = new Array();

                    // 获得当前扫描到的所有设备
                    for (var i = 0; i < res.beacons.length; i++) {
                      array_uuid.push(res.beacons[i].uuid);
                      if (res.beacons[i].rssi != 0) {
                        array_distance[i] = Math.pow(10, ((Math.abs(res.beacons[i].rssi) - 59) / (10 * 2.0)));
                        if (array_distance[i] < that.data.user_close_distance) {
                          that.data.user_close_distance = array_distance[i];

                        }
                      } else {
                        array_distance.push(Infinity);
                      }

                      // 找到最近的一个设备：距离最近且距离小于阈值
                      var min_distance_index = -1;
                      var min_distance = Infinity;

                      for (var i = 0; i < array_distance.length; i++) {
                        if (array_distance[i] < min_distance) { // 20米很不稳定
                          min_distance = array_distance[i];
                          min_distance_index = i;
                        }

                      }




                      if (min_distance_index != -1) {
                        var area_id = that.query_beacon(array_uuid[min_distance_index]);

                        console.log("pre" + that.data.user_area_uuid);
                        console.log("now" + array_uuid[min_distance_index]);


                        if (that.data.user_state == 'enter') {
                          // 此时用户离开这个展区
                          if (that.data.user_area_uuid != array_uuid[min_distance_index]) {
                            console.log("用户所在展区" + area_id);
                           
                            that.data.user_state = '';
                            that.data.end_time = new Date();
                            console.log("ddd" + that.data.start_time);
                            wx.request({
                              url: app.globalData.url + '/curation/personal/record/',
                              method: "POST",
                              data: {
                                uid: app.globalData.UId,
                                eid: e.currentTarget.dataset.id,
                                begin: that.data.start_time,
                                end: that.data.end_time,
                                uuid: that.data.user_area_uuid,
                              },
                              header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                              },
                              success: res => {
                                console.log("用户驻留信息发送成功");
                                that.data.user_area_uuid = array_uuid[min_distance_index];
                              }
                            });
                            that.data.start_time = new Date();

                          }
                        } else {
                          that.data.user_state = 'enter';
                          that.data.start_time = new Date();
                          console.log("enter" + array_uuid[min_distance_index]);
                          that.data.user_area_uuid = array_uuid[min_distance_index];
                        }

                      } else {
                        console.log("用户没有进入展区");
                      }





                    }
                  }
                });
                // 超时停止扫描  
                // setTimeout(function () {
                //   wx.stopBeaconDiscovery({
                //     success: function () {
                //       console.log("停止扫描设备！");
                //     }
                //   });
                // }, 5 * 1000);
              },
              fail: function () {
                console.log("呜呜呜，失败了")

              }
            });
          },
          fail: res => {
            
            wx.showToast({
              title: '请打开蓝牙设备',
              icon : 'none',
              duration: 1000,
            })
          }
        })

      }
    }
  },
  onShow: function () {
    let vm = this;
    vm.getUserLocation();
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: res => {
        vm.getLocation();
      }
      // success: (res) => {
      //   console.log(JSON.stringify(res))
      //   // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      //   // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      //   // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      //   if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
      //     wx.showModal({
      //       title: '请求授权当前位置',
      //       content: '需要获取您的地理位置，请确认授权',
      //       success: function (res) {
      //         if (res.cancel) {
      //           wx.showToast({
      //             title: '拒绝授权',
      //             icon: 'none',
      //             duration: 1000
      //           })
      //         } else if (res.confirm) {
      //           wx.openSetting({
      //             success: function (dataAu) {
      //               if (dataAu.authSetting["scope.userLocation"] == true) {
      //                 wx.showToast({
      //                   title: '授权成功',
      //                   icon: 'success',
      //                   duration: 1000
      //                 })
      //                 //再次授权，调用wx.getLocation的API
      //                 vm.getLocation();
      //               } else {
      //                 wx.showToast({
      //                   title: '授权失败',
      //                   icon: 'none',
      //                   duration: 1000
      //                 })
      //               }
      //             }
      //           })
      //         }
      //       }
      //     })
      //   } else if (res.authSetting['scope.userLocation'] == undefined) {
      //     //调用wx.getLocation的API
      //     vm.getLocation();
      //   }
      //   else {
      //     //调用wx.getLocation的API
      //     vm.getLocation();
      //   }
      // }
    })
  },
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: res => {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: res => {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  onstop: function () {
    console.log("onstop:" + app.globalData.url + '/curation/personal/end?uid=' + app.globalData.UId + '&eid=' + this.data.cur_eid + "flag : " + this.data.flag);
    var that = this;
    var eid = that.data.cur_eid;
    if (this.data.flag == 1) {

      if (that.data.user_area_uuid != '') {
        wx.request({
          url: app.globalData.url + '/curation/personal/record/',
          method: "POST",
          data: {
            uid: app.globalData.UId,
            eid: eid,
            begin: that.data.start_time,
            end: new Date(),
            uuid: that.data.user_area_uuid,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            console.log("用户驻留信息发送成功");


          }
        })
      };
      wx.request({
        url: app.globalData.url + '/curation/personal/end?uid=' + app.globalData.UId + '&eid=' + this.data.cur_eid,
        success: res => {
          console.log("请求成功")
        },
        fail: res => {
          console.log("请求失败")
        }
      });
      wx.stopBeaconDiscovery({
        success: res => {
          console.log("关闭设备监测")
        }
      })
      that.setData({
        flag: 0,
        cur_eid: null,
        uuid:'',
        user_state:'',
        start_time:null,
        end_time:null
      })
    };
  },
  navtodetails: function (e) {

    // console.log("[eId]->"+JSON.stringify(e.currentTarget))
    //  console.log("eid = " + e.currentTarget.id)
    wx.navigateTo({
      url: '../details/details?eId=' + e.currentTarget.id,
      success: res => {
        console.log("success " + JSON.stringify(res))
      },
      fail: function (res) {
        console.log("fail " + JSON.stringify(res))
      },
    })
  },
  query_beacon: function (uuid) {
    var that = this;
    for (var i = 0; i < that.data.uuids.length; i++) {
      if (that.data.uuids[i] == uuid) {
        return i + 1;
      }

    }
    return -1;

  },
  maxCountElement: function (arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      var key = arr[i];
      if (obj[key]) {
        obj[key]++;
      } else {
        obj[key] = 1;
      }
    }

    var maxCount = 0;
    var maxElement = arr[0];
    for (var key in obj) {
      if (maxCount < obj[key]) {
        maxCount = obj[key];
        maxElement = key;
      }
    }
    return maxElement;
  },

})
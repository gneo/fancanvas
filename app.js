//app.js


App({
  onLaunch: function () {
    wx.env.NODE_ENV = 'production'
    console.log(wx.env.NODE_ENV)
  },

  // 是否 有权限
  getAuthority:function(){
    if(this.globalData.userDto)
    {
      //authed: false
      if(this.globalData.userDto.authed)
      {
        // 有权限
        return 2
      }else{
        // 登录了 没有权限
        return 1
      }
    }else{
      // 没有登录
      return 0
    }
  },
  // 是否 登录
  hasLogin:function(){
    if(this.globalData.userDto)
    {
      return true
    }else{
      return false
    }
  },
  globalData: {
    navHeight: 0,
    loginBackPath:'/pages/index/index',
    customCameraData:{},
    photographList:[],
    photographResultList:[],
    uploadImageFromData:{},
    loginData:null, // 登录 存储的 data code 什么的
    userDto:null
  }
})
// pages/authorize/authorize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

/***********************************授权***********************************************/
  // 点击授权处理
  bindGetUserInfo: function (e) {
    console.log(e);
    // 拒绝授权的话e.detail没有userInfo,同意授权才有, 没有这个判断也可以的吧?
    if (!e.detail.userInfo) {
      return
    }
    
    // 用户同意授权
    // 将用户信息存储到本地
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', e.detail.userInfo)

    // FIXME:
    // this.login(); // 没有后台可以先不走这一步,直接跳转
    wx.navigateBack(); // 返回上一步, 如果有后台, 需要注释此处
  },

  /***********************************登录********************************************/ 
  login: function () {
    let self = this;
    let token = wx.getStorageSync('token');
    console.log({token})
    // 1. 如果本地已保存有token, 检验token是否有效. 如果有效, 返回到之前页面; 如果无效, 删除token, 回调login函数
    if (token) {
      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/check-token',
        data: {token},
        success: function (res) {
          if (res.data.code != 0) {
            // token已失效, 删除token, 重新调用此函数
            wx.removeStorageSync('token')
            self.login();
          } else {
            // 关闭当前页, 返回上一页面或多级页面, 可通过wx.getCurrentPages()获取当前页面栈,决定返回几层.
            wx.navigateBack();
          }
        }
      })
      return
    }

    // 2. 如果token不存在
    wx.login({
      success:function (res) {
        // 返回参数: code:用户临时登录凭证（有效期五分钟）, 传到后台调用code2Session，使用 code 换取 openid 和 session_key 等信息
        console.log(res)
        // 将code传送到服务器后台
        wx.request({
          url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res)
            // 因为appid并不是和后台配置的一致(自己玩的没有后台..), 所以不能正确获取登录信息, 故得到响应是错误码为40029
            if (res.data.code == 10000) {
              // 没有注册过就去注册
              self.registerUser();
              return;
            }
            if (res.data.code!=0) {
              // 登录错误
              wx.showModal({
                title: '提示',
                content: '无法登录, 请重试',
                showCancel: false
              })
              return;
            }

            // 如果注册过, 并成功登录
            wx.setStorageSync('token', res.data.data.token); // 保存最新的token
            wx.setStorageSync('uid', res.data.data.touidken); //  ????

            // 关闭当前页, 返回上一页面或多级页面, 可通过wx.getCurrentPages()获取当前页面栈,决定返回几层.
            wx.navigateBack();
          }
        })
      }
    }) 
  },
  /***********************************注册********************************************/
  registerUser: () => {
    let self = this;
    wx.login({ // code可以从上一步登录验证中传递下来的
      success: res => {
        wx.getUserInfo({
          success: function (res) {
            let iv = res.iv; // 加密算法的初始量
            let encryptedData = res.encryptedData; // 包括敏感数据在内的完整用户信息的加密数据
            // 调用注册接口
            wx.request({
              url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/register/complex',
              data: { code: code, encryptedData: encryptedData, iv: iv },
              success: res => {
                wx.hideLoading();
                self.login();
              }
            })
          }
        })
      }
    })
  }
})
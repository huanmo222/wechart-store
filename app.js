//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 获取用户信息, 使用wx.getSettting()不会发起授权弹窗, 需改用button方式触发.
    // 如果没有经过授权, {authSetting:{ }, errMsg:"getSetting:ok"}
    // 如果已经授权, 返回的数据是{authSetting:{ scope.userInfo: true }, errMsg:"getSetting:ok"}
    // 理解: 这个步骤的作用是: 如果从没在index.js中button组件授过权, 不进行任何操作; 如果已经授权了, 将会请求用户信息保存到全局数据中, 但是返回数据可能较晚, 而index.js的onLoad已经运行并需要用到全局数据, 是获取不到数据的, 所以如果获取不到就定义一个app上的回调函数userInfoReadyCallback, 如果定义了, 说明没有index.js onLoad时没有获取到数据, 然后app.js收到才请求的用户信息,需要回调以下这个回调函数, 重新将数据赋值给index.js的数据里.
    // 授权操作是在index.js中, app.js的只是用来存储到全局数据的.
  //   wx.getSetting({
  //     success: res => {
  //       // 判断是否授权, 如果授权进入下一步获取用户信息
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo
  //             console.log(this.globalData.userInfo)

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             // 判断userInfoReadyCallback 是否定义了, 如果没有定义说明其在Page.onLoad 定义userInfoReadCallback 之前运行的，说明app.globalInfo.userInfo已经包含了用户登录的信息了, 即走了index.js的onLoad中第一条件分支中。
  //             // userInfoReadyCallback定义在demo的index.js中, 是回调函数, 重新保存请求到的用户信息.

  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  },
  globalData: {
    userInfo: null,
    subDomain: 'tz',
    version: '4.0.0',
    shareProfile: '百款精品商品，总有一款适合您' // 转发话语
  }
})
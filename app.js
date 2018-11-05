//app.js
App({
  onLaunch: function () {
    let self = this;
    // 请求商店名称
    wx.request({
      url: 'https://api.it120.cc/' + self.globalData.subDomain + '/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
          if (self.getMallNameCallback) {
            self.getMallNameCallback();
          }
        }
      }
    })
    // 请求好评送分数
    wx.request({
      url: 'https://api.it120.cc/' + self.globalData.subDomain + '/score/send/rule',
      data: {
        key: 'goodReputation'
      },
      success: function (res) {
        if (res.data.code == 0) {
          // console.log({ res })
          self.globalData.order_reputation_score = res.data.data[0].score;
          if (self.getReputationScoreCallback) {
            self.getReputationScoreCallback();
          }
        }
      }
    })
    // 请求充值最少金额
    wx.request({
      url: 'https://api.it120.cc/' + self.globalData.subDomain + '/config/get-value',
      data: {
        key: 'recharge_amount_min'
      },
      success: function (res) {
        if (res.data.code == 0) {
          // console.log({res})
          self.globalData.recharge_amount_min = res.data.data.value;
          if (self.getRechargeAmountMinCallback) {
            self.getRechargeAmountMinCallback();
          }
        }
      }
    })

    // 获取砍价设置
    wx.request({
      url: 'https://api.it120.cc/' + self.globalData.subDomain + '/shop/goods/kanjia/list',
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          console.log({ res })
          self.globalData.kanjiaList = res.data.data.result;
          if (self.getKanJiaListCallback) {
            self.getKanJiaListCallback();
          }
        }
      }
    })

    // 判断是否登录, 
    // FIXME: 因非正式appid, 请求不到token, 此处先注释掉
    let token = wx.getStorageSync('token');
    // if (!token) {
    //   self.goLoginPageTimeOut()
    //   return
    // }

    // 检验token是否有效
    wx.request({
      url: 'https://api.it120.cc/' + self.globalData.subDomain + '/user/check-token',
      data: {
        token: token
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.removeStorageSync('token')
          // FIXME: 因非正式appid, 请求不到token, 此处先注释掉
          // self.goLoginPageTimeOut();  
        }
      }
    })

  },
  // 如果没有登录信息, 则跳转到登录页面. 
  // bug: 进入到首页start且没有登录时, 会跳转两次
  goLoginPageTimeOut () {
    let currentUrl = getCurrentPages()
    setTimeout(() => {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
    }, 1000)
  },
  globalData: {
    userInfo: null,
    subDomain: 'tz',
    version: '4.0.0',
    shareProfile: '百款精品商品，总有一款适合您' // 转发话语
  }
})
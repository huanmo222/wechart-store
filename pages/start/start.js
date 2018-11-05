// pages/start/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // remind: '加载中'
    remind: '',
    angle: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载, 只触发了一次, app.js请求的数据可能还未返回, 此处变获取不到, 需要做回调.
   */
  onLoad: function (options) {
    console.log('star--onLoad')
    console.log(wx.getStorageSync('mallName'))
    let mallName = wx.getStorageSync('mallName');
    // 设置首页标题名
    if (mallName) {
      wx.setNavigationBarTitle({
        title: wx.getStorageSync('mallName')
      })
    } else {
      // 如果商店名称还不存在, 则设置一个回调函数, 使缓存本地成功后重新调用.
      app.getMallNameCallback = () => {
        wx.setNavigationBarTitle({
          title: wx.getStorageSync('mallName')
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
    // 获取本地头像信息
    let self = this;
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/authorize/authorize',
      })
    } else {
      self.setData({
        userInfo
      })
    }
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

  goToIndex: function () {
    // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
    wx.switchTab({
      url: '/pages/index/index',
    });
  }

})
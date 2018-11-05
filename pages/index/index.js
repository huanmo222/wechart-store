//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,  // 是否显示面板指示点
    autoplay: true, // 自动播放
    interval: 3000, //自动切换时间间隔
    duration: 1000, // 滑动动画时长
    imgUrls: [],

  },
  onLoad: function () {
    let self = this;
    // FIXME: 所有写在app.js的请求, 需要做回调, 这里没做.
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName'),
    })
  }
})

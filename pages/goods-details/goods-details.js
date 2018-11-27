// pages/goods-details/goods-details.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,  // 是否显示面板指示点
    autoplay: true, // 自动播放
    interval: 3000, //自动切换时间间隔
    duration: 1000, // 滑动动画时长
    banners: [], // 轮播图
    id: null, // 商品id, 从路由获得
    selectSizePrice: 0, // 价格,需要计算得到.
    curGoodsKanjia: 0,

    // 购物车
    shopCarInfo: {},  // 购物车信息
    shopNum: 0, // ?
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 如果有邀请id, 存储
    if (options.inviter_id) {
      wx.setStorage({
        key: 'inviter_id_' + options.id,
        data: options.inviter_id,
      })
    }
    // 砍价id?
    this.data.kjId = options.kjId
    console.log(this.data.kjId)

    this.setData({
      id: options.id
    })
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        console.log({'shopCarInfo': res});
        _this.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        })
      },
    })
    this.getGoodsDetail()
    this.getKanjiaInfo(options.id)
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

  // 获取商品详情
  getGoodsDetail () {
    let _this = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
      data: {
        id: this.data.id
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          goodsDetail: res.data.data
        })
        if (res.data.data.basicInfo.videoId) {
          _this.getVideoSrc(res.data.data.basicInfo.videoId)
        }

      }
    })
  },

  // 获取详情视频
  getVideoSrc (videoId) {
    let _this = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
      data: {
        videoId
      },
      success: function(res) {
        console.log(res)
        if (res.data.code === 0) {
          _this.setData({
            videoMp4Src: res.data.data.fdMp4
          })
        }
      }
    })
  },

  // 获取砍价信息
  getKanjiaInfo(gid) {
    let _this = this;
    // 在app.js中已经请求了可以砍价的商品信息, 并存储到了全局数据中
    // 但是有个问题, 如果直接打开此商品页面, 此处比app.js收到数据先编译, 就不能正确获取砍价数据,可以设置一个回调函数

    // 没有砍价信息的情况下, 设置curGoodsKanjia为null
    if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length == 0) {
      // 因为不知道此项目后台的返回kanjiaList规则, 所以此处没有设置, 自己做的时候可以注意处理下.
      // app.getKanJiaListCallback = () => {}
      _this.setData({
        curGoodsKanjia: null
      });
      return;
    }
    // 当kanjiaList有数据时, 判断当前商品是否包含在可砍价商品的列表中, 返回第一个元素的值(此处是一个对象), 没有则返回undefined
    let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
      return ele.goodsId == gid
    })
    // 设置curGoodsKanjia到data数据上
    if (curGoodsKanjia) {
      _this.setData({
        curGoodsKanjia: curGoodsKanjia
      });
    } else {
      _this.setData({
        curGoodsKanjia: null
      });
    }  
  },

  // 去砍价
  goKanjia () {
    let _this = this;
    if (!_this.data.curGoodsKanjia) {
      return;
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/kanjia/join',
      data: {
        kjid: _this.data.curGoodsKanjia.id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.navigateTo({
            url: "/pages/kanjia/index?kjId=" + res.data.data.kjId + "&joiner=" + res.data.data.uid + "&id=" + res.data.data.goodsId
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  // 请求拼团信息
  getPingtuanList () {
    let _this = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/pingtuan/list',
    })
  }
  
})
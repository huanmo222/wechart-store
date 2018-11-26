//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,  // 是否显示面板指示点
    autoplay: true, // 自动播放
    interval: 3000, //自动切换时间间隔
    duration: 1000, // 滑动动画时长
    banners: [], // 轮播图
    categories: [], // 分类类名
    activeCategoryId: 0, // 当前选中ID
    curPage: 1, // 相当于pageIndex
    pageSize: 20, // 每次请求多少
    searchInput: '', // 搜索框内容
    goods: [],  // 商品列表
    loadingMoreHidden: true, // 隐藏底部加载更多
    scrollTop: 0,
    background: ''

  },
  onLoad: function () {
    let _this = this;
    // FIXME: 所有写在app.js的请求, 需要做回调, 这里没做.
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName'),
    })
    // banner图片请求
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName'
      },
      success: function(res) {
        if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        }
        if (res.data.code === 0) {
          _this.setData({
            banners: res.data.data
          })
        }
      }
    });
    // 分类类名请求
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function(res) {
        if (res.data.code === 0) {
          let arr = res.data.data;
          arr.unshift({ id: 0, name: "全部" });
          _this.setData({
            categories: arr,
            activeCategoryId: 0,
            curPage: 1
          })
        }
      }
    })
    _this.getNotice();
    _this.getCoupons();
    _this.getGoodsList(0);
  },
  // 获取货物列表, categoryId:类型, append: 是否goods列表已经存在数据?
  // FIXME: 类型可以不用传的, 是this.data.activeCategoryId.
  getGoodsList (categoryId, append) {
    // 全部
    if (categoryId == 0) {
      categoryId = ''
    }
    let _this = this;
    wx.showLoading({
      mask: true,
    });
    // console.log({ curPage: _this.data.curPage})
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: categoryId,
        nameLike: _this.data.searchInput,
        page: _this.data.curPage,
        pageSize: _this.data.pageSize
      },
      success: function(res) {
        wx.hideLoading();
        // console.log({res})
        // 没有请求到新的数据, 显示loadingMore(没有数据了)? 
        if (res.data.code == 404 || res.data.code == 700) {
          let newData = { loadingMoreHidden: false };
          if (!append) {
            newData.goods = [];
          }
          // 注意此处写法, setData(newData)是直接将data中的goods和loadingMoreHidden覆盖掉了.
          _this.setData(newData)
          return
        }
        let goods = [];
        if (append) {
          goods = _this.data.goods;
        }
        goods.push(...res.data.data);
        _this.setData({
          loadingMoreHidden: true,
          goods: goods,
        });
        // console.log({goods})
      }
    })
  },

  // 获取公告信息
  getNotice () {
    var _this = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
      data: { pageSize: 5 },
      success: function (res) {
        if (res.data.code == 0) {
          // console.log({ noticeList: res.data.data.dataList})
          _this.setData({
            noticeList: res.data.data.dataList
          })
        }
      }
    })
  },
  // 获取优惠券
  getCoupons() {
    var _this = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: { type: '' },
      success: function (res) {
        if (res.data.code == 0) {
          // console.log(res)
          _this.setData({
            coupons: res.data.data
          })
        }
      }
    })
  },
  // 点击轮播图图片
  tapBanner(e) {
    // console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: '/pages/goods-details/goods-details?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  // 点击分类tab
  tabClick (e) {
    // console.log(e)
    this.setData({
      activeCategoryId: e.currentTarget.id,
      curPage: 1
    })
    this.getGoodsList(this.data.activeCategoryId)
  },
  toDetailsTap (e) {
    let _this = this;
    wx.navigateTo({
      url: "/pages/goods-details/goods-details?id=" + e.currentTarget.id,
    })

  },
  gitCoupon (e) {
    // console.log(e.currentTarget.id)
    let _this = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '小主, 您来晚了',
            showCancel: false,
            confirmColor: '#69C3AA'
          })
          return
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '您已经领过了哦~',
            showCancel: false,
            confirmColor: '#69C3AA'
          })
          return
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false,
            confirmColor: '#69C3AA'
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false,
            confirmColor: '#69C3AA'
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000,
            confirmColor: '#69C3AA'
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false,
            confirmColor: '#69C3AA'
          })
        }
      }
    })
  },
  onReachBottom() {
    console.log(this.data.curPage)
    // (优化方向)返回一个total, 判断是否已经得到全部数据, 如果得到就不要再请求了.
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
  },
  onPageScroll (e) {
    // console.log(e.scrollTop)
    this.setData({
      scrollTop: e.scrollTop
    })
    // this.setData({
    //   background: 'rgba(105,195,170,' + (Math.round(0.035 * e.scrollTop * 10) / 10+ 0.3) + ')'
    // })
  },
  toSearch (e) {
    this.setData({
      curPage: 1
    })
    this.getGoodsList(this.data.activeCategoryId);
  },
  listenerSearchInput (e) {
    this.setData({
      searchInput: e.detail.value
    })
  }
})

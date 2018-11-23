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
    loadingMoreHidden: true // 加载更多


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
        // 没有请求到数据, 显示loadingMore? 
        if (res.data.code == 404 || res.data.code == 700) {
          let newData = { loadingMoreHidden: false };
          if (!append) {
            newData.goods = [];
          }
          _this.setData({newData})
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
          console.log({ noticeList: res.data.data.dataList})
          _this.setData({
            noticeList: res.data.data.dataList
          })
        }
      }
    })
  },

  // 点击轮播图图片
  tapBanner(e) {
    console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: '/pages/goods-details/index?id=' + e.currentTarget.dataset.id,
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
  }

})

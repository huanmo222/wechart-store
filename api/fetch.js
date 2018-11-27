const requestPromise = (url, data, method) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      success: res => resolve(res)
    })
  })
}
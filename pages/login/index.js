// pages/login/index.js
Page({
  handleLogin(e) {
    console.log(e);

    const {userInfo} = e.detail;
    wx.setStorageSync("userInfo", userInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})
// pages/docLogin/docLogin.js
Page({
  data: {
    username: '',
    password: '',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  onUsername(e) { this.setData({ username: e.detail.value }); },
  onPassword(e) { this.setData({ password: e.detail.value }); },

  async onLogin() {
    const { username, password } = this.data;
    if (!username || !password) { this.setData({ message: '请输入用户名和密码' }); return; }
    const { request } = require('../../utils/request');
    try {
      const res = await request({ url: '/auth/login', method: 'POST', data: { username, password } });
      if (res && res.success) {
        const token = res.data && res.data.token;
        if (token) wx.setStorageSync('token', token);
        // goto doctor index
        wx.reLaunch({ url: '/pages/docIndex/docIndex' });
      } else {
        this.setData({ message: res && res.message || '登录失败' });
      }
    } catch (err) {
      console.error('doc login err', err);
      this.setData({ message: err && err.body && err.body.message || '网络或服务错误' });
    }
  }
  ,

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
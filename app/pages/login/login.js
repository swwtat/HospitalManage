// pages/login/login.js
const { request } = require('../../utils/request.js');
Page({
  data: {
    username: '',
    password: ''
  },

  onRegister() {
    wx.navigateTo({
      url: '/pages/accountRegister/accountRegister',
    })
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async onLogin() {
    const { username, password } = this.data;
    wx.setStorageSync('account_name',username);
    if (!username || !password) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    try {
      const res = await request({
        url: '/auth/login',
        method: 'POST',
        data: { username, password }
      });

      wx.hideLoading();

      if (res && res.success) {
        wx.showToast({ title: '登录成功', icon: 'success' });
        const token = res.data && res.data.token;
        if (token) wx.setStorageSync('token', token);
        // 可存储 user id / role
        if (res.data && res.data.id) wx.setStorageSync('account_id', res.data.id);
        setTimeout(() => wx.navigateBack(), 800);
      } else {
        wx.showToast({ title: res && res.message ? res.message : '登录失败', icon: 'none' });
        wx.removeStorageSync('account_name');
      }

    } catch (error) {
      wx.hideLoading();
      console.error('登录失败:', error);
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    }
  
  },



  onForgetPwd() {
    wx.navigateTo({ url: '/pages/forget/forget' });
  }
});

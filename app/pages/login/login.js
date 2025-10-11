// pages/login/login.js
Page({
  data: {
    username: '',
    password: ''
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onLogin() {
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({
        title: '请输入账号和密码',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({ title: '登录中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '登录成功', icon: 'success' });
      wx.navigateTo({ url: '/pages/home/home' });
    }, 1000);
  },

  onRegister() {
    wx.navigateTo({ url: '/pages/registerUser/registerUser' });
  },

  onForgetPwd() {
    wx.navigateTo({ url: '/pages/forget/forget' });
  }
});

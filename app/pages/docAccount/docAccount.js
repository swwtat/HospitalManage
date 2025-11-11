// pages/docAccount/docAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  onOld(e) { this.setData({ old: e.detail.value }); },
  onNew(e) { this.setData({ nw: e.detail.value }); },

  async onChange() {
    const oldPassword = this.data.old; const newPassword = this.data.nw;
    if (!oldPassword || !newPassword) return this.setData({ message: '请输入旧密码和新密码' });
    const { request } = require('../../utils/request');
    try {
      const res = await request({ url: '/auth/change-password', method: 'POST', data: { oldPassword, newPassword } });
      if (res && res.success) { wx.showToast({ title: '修改成功' }); this.setData({ message: '修改成功' }); }
      else this.setData({ message: res && res.message || '修改失败' });
    } catch (err) {
      console.error('change pwd err', err);
      this.setData({ message: err && err.body && err.body.message || '网络或服务错误' });
    }
  },

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
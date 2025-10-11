// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onClick: function(e) {
    const action = e.currentTarget.dataset.action;
    // 根据 action 跳转不同页面
    let url = '';
    switch(action) {
      case '用户登录':
        url = '/pages/login/login';
        break;
      case '个人信息':
        url = '/pages/info/info';
        break;
      case '历史查询':
        url = '/pages/appointment/appointment';
        break;
      case '我的订单':
        url = '/pages/health/health';
      
        break;
      default:
        wx.showToast({
          title: '功能未定义',
          icon: 'none'
        });
        return;
    }
    wx.navigateTo({ url });
  },
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
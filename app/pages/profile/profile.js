// pages/profile/profile.js
Page({
  data: {
    id_top:'',
    logged:'',
  },

  onClick: function(e) {
    const action = e.currentTarget.dataset.action;
    // 根据 action 跳转不同页面
    let url = '';
    
    switch(action) {
      case '用户登录':
        if (!wx.getStorageSync('account_id')) {
          url = '/pages/login/login';
        } else {
          url = '/pages/setting/setting'; 
        }
        break;
        
      case '个人信息':
        if (!this.logged) {
          this.showLoginPrompt();
          return;
        }
        url = '/pages/info/info';
        break;
        
      case '历史查询':
        if (!this.logged) {
          this.showLoginPrompt();
          return;
        }
        url = '/pages/appointment/appointment';
        break;
        
      case '我的订单':
        if (!this.logged) {
          this.showLoginPrompt();
          return;
        }
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
  
  showLoginPrompt: function() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  onLoad(options) {
    this.setData({logged:wx.getStorageSync('account_id')});
    
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
    setTimeout(() => this.setData({id_top:wx.getStorageSync('account_name')}), 400);
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
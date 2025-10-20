// pages/docProfile/docProfile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    filteredDoctors: [],
    selectedDept: '请选择科室',
    selectedDoc: '请选择医生',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  goToDepartment() {
    wx.navigateTo({
      url: '/pages/deptPick/deptPick'
    });
  },
  goToDocs() {
    wx.navigateTo({
      url: '/pages/docPick/docPick'
    });
  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const selected = wx.getStorageSync('selectedDepartment');
    if (selected) {
      this.setData({
        selectedDept: selected,
      });
      wx.removeStorageSync('selectedDepartment'); // 用完后清除缓存
    }
    const selectedDocs = wx.getStorageSync('selectedDoc');
    if (selectedDocs) {
      this.setData({
        selectedDoc: selectedDocs
      });
      wx.removeStorageSync('selectedDoc'); // 用完后清除缓存
    }
  },
  onDeptChange: function(e) {

  },  
  onDocChange: function(e) {

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
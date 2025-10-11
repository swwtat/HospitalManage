// pages/profileForm/profileForm.js
Page({
  data: {
    role: 'student', // 默认学生
    genderOptions: ['男', '女'],
    gender: '',
    idNumber: '',
    idCard: '',
    history: ''
  },

  switchToStudent() {
    this.setData({ role: 'student' });
  },

  switchToTeacher() {
    this.setData({ role: 'teacher' });
  },

  onIDInput(e) {
    this.setData({ idNumber: e.detail.value });
  },

  onIDCardInput(e) {
    this.setData({ idCard: e.detail.value });
  },

  onGenderChange(e) {
    this.setData({ gender: this.data.genderOptions[e.detail.value] });
  },

  onHistoryInput(e) {
    this.setData({ history: e.detail.value });
  },

  onSubmit() {
    const { idNumber, idCard, gender } = this.data;
    if (!idNumber || !idCard || !gender) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({ title: '保存中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
      wx.navigateBack();
    }, 1000);
  }
});

// pages/profileForm/profileForm.js
Page({
  data: {
    role: 'student', // 默认学生
    genderOptions: ['男', '女'],
    gender: '',
    name:'',
    idNumber: '',
    idCard: '',
    history: ''
  },

  onLoad() {
    // 在页面加载时尝试获取已保存的 profile
    const { request } = require('../../utils/request');
    wx.showLoading({ title: '加载中...' });
    request({ url: '/api/patient/profile', method: 'GET' })
      .then(res => {
        wx.hideLoading();
        if (res && res.success && res.data) {
          const p = res.data;
          this.setData({
            name: p.display_name || '',
            // 保守起见，将后端存储的 idcard 同步到两个字段
            idNumber: p.idcard || '',
            idCard: p.idcard || '',
            gender: p.gender || '',
            history: (p.extra && p.extra.history) || '',
            role: (p.extra && p.extra.role) || this.data.role
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.warn('读取 profile 失败', err);
        // 不阻塞用户，静默失败并允许用户填写
      });
  },

  switchToStudent() {
    this.setData({ role: 'student' });
  },

  switchToTeacher() {
    this.setData({ role: 'teacher' });
  },

  onNameInput(e){
    this.setData({name: e.detail.value})
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
    const { idNumber, idCard, gender, history, role } = this.data;
    if (!idNumber || !idCard || !gender) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const { request } = require('../../utils/request');
    const payload = {
      display_name: this.data.name || '',
      // 后端在验证时接受 idNumber 或 idcard，为兼容性我们同时发送两者
      idNumber: idNumber,
      idcard: idCard,
      gender: gender,
      extra: { history, role }
    };

    wx.showLoading({ title: '保存中...' });
    request({ url: '/api/patient/submit', method: 'POST', data: payload })
      .then(res => {
        wx.hideLoading();
        if (res && res.success) {
          wx.showToast({ title: '保存并验证成功', icon: 'success' });
          wx.navigateBack();
        } else {
          wx.showToast({ title: (res && res.message) ? res.message : '保存失败', icon: 'none' });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('保存失败', err);
        const msg = (err && err.body && err.body.message) ? err.body.message : '网络或服务错误';
        wx.showToast({ title: msg, icon: 'none' });
      });
  }
});

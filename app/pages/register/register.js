// pages/register/register.js
Page({
  data: {
    registerRange: ['普通号','专家号','特需号'],
    doctors: [],
    selectedDept: '请选择科室',
    selectedDoctor: '请选择医生',
    selectedRegi:'请选择号别',
    message: ''
  },
  onShow() {
    const selected = wx.getStorageSync('selectedDepartment');
    if (selected) {
      this.setData({
        selectedDept: selected
      });
      wx.removeStorageSync('selectedDepartment'); // 用完后清除缓存
    }
  },
  goToDepartment() {
    wx.navigateTo({
      url: '/pages/deptPick/deptPick'
    });
  },
  onRegiChange: function(e) {
    const index = e.detail.value;
    const regi = this.data.registerRange[index];
    this.setData({
      selectedRegi: regi,
    });
  },
  onDateSelected(e) {
    const { date } = e.detail
    console.log('用户选择的挂号日期:', date)
    wx.showToast({
      title: `已选择：${date}`,
      icon: 'success'
    })
    // TODO: 这里可以根据日期查询医生排班
  },
  onDoctorSelected(e) {
    const { doctor } = e.detail;
    this.setData({ selectedDoctor: doctor });
    console.log('已选择医生:', doctor);
  },

  onDeptChange: function(e) {

  },

  onDoctorChange: function(e) {
    const index = e.detail.value;
    const doctor = this.data.doctors[index];
    this.setData({
      selectedDoctor: doctor
    });
  },



  register: function() {
    if (this.data.selectedDoctor === '请选择医生') {
      this.setData({ message: '请选医生后再挂号' });
    } else {
      this.setData({ message: `挂号成功：${this.data.selectedDept} - ${this.data.selectedDoctor}-${this.data.selectedRegi}` });
      
    }
  }
});

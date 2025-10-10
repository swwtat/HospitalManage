Page({
  data: {
    departments: [
      { name: '内科', subs: ['呼吸内科', '心血管内科', '消化内科', '内分泌科'] },
      { name: '外科', subs: ['普外科', '骨科', '神经外科', '心胸外科'] },
      { name: '儿科', subs: ['小儿内科', '小儿外科'] },
      { name: '妇产科', subs: ['妇科', '产科'] },
      { name: '五官科', subs: ['耳鼻喉科', '眼科', '口腔科'] }
    ],
    multiArray: [],
    multiIndex: [0, 0]
  },

  onLoad() {
    this.initPicker();
  },

  initPicker() {
    const first = this.data.departments.map(d => d.name);
    const second = this.data.departments[0].subs;
    this.setData({
      multiArray: [first, second]
    });
  },

  bindMultiPickerChange(e) {
    const { multiIndex, multiArray } = this.data;
    const selectedDept = multiArray[0][multiIndex[0]];
    const selectedSub = multiArray[1][multiIndex[1]];
    const result = `${selectedDept} - ${selectedSub}`;

    wx.setStorageSync('selectedDepartment', result);
    wx.showToast({
      title: `${selectedDept} - ${selectedSub}`,
      icon: 'success'
    });
        // 延迟返回主页
        setTimeout(() => {
          wx.navigateBack();
        }, 800);
  },

  bindMultiPickerColumnChange(e) {
    const { column, value } = e.detail;
    let { multiArray, multiIndex, departments } = this.data;

    multiIndex[column] = value;

    if (column === 0) {
      const subs = departments[value].subs;
      multiArray[1] = subs;
      multiIndex[1] = 0;
    }

    this.setData({
      multiArray,
      multiIndex
    });
  }
});

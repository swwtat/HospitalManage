// pages/book/book.js
const { request } = require('../../utils/request');

Page({
  data: {
    departments: [],
    deptOptions: [],
    deptIndex: 0,
    doctors: [],
    doctorIndex: 0,
    doctorsNames: [],
    date: '',
    slotIndex: 0,
    slots: [
      { label: '上午 08:00-10:00', value: '8-10' },
      { label: '上午 10:00-12:00', value: '10-12' },
      { label: '下午 14:00-16:00', value: '14-16' },
      { label: '下午 16:00-18:00', value: '16-18' }
    ],
    slotsLabels: ['上午 08:00-10:00','上午 10:00-12:00','下午 14:00-16:00','下午 16:00-18:00'],
    minDate: (new Date()).toISOString().slice(0,10),
    message: ''
  },

  onLoad() {
    this.loadDepartments();
  },

  async loadDepartments() {
    try {
      const res = await request({ url: '/api/departments', method: 'GET' });
      if (res && res.success) {
        const list = [];
        res.data.forEach(p => {
          // push parent
          list.push({ id: p.id, name: p.name });
          if (p.children && p.children.length) {
            p.children.forEach(c => list.push({ id: c.id, name: `${p.name} / ${c.name}` }));
          }
        });
        this.setData({ departments: list, deptOptions: list.map(d => d.name) });
      }
    } catch (e) {
      console.error('loadDepartments err', e);
    }
  },

  async onDeptChange(e) {
    const idx = e.detail.value;
    this.setData({ deptIndex: idx, doctors: [], doctorIndex: 0 });
    const dep = this.data.departments[idx];
    if (dep && dep.id) {
      try {
        const r = await request({ url: `/api/doctor?department_id=${dep.id}`, method: 'GET' });
        if (r && r.success) {
          const docs = r.data || [];
          this.setData({ doctors: docs, doctorsNames: docs.map(d => d.name) });
        }
      } catch (err) { console.error('load doctors err', err); }
    }
  },

  onDoctorChange(e) {
    this.setData({ doctorIndex: e.detail.value });
  },

  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  onSlotChange(e) {
    this.setData({ slotIndex: e.detail.value });
  },

  async submit() {
    const account_id = wx.getStorageSync('account_id');
    if (!account_id) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const dep = this.data.departments[this.data.deptIndex];
    const doc = this.data.doctors[this.data.doctorIndex];
    const date = this.data.date;
    const slot = this.data.slots[this.data.slotIndex] && this.data.slots[this.data.slotIndex].value;
    if (!dep || !dep.id) {
      wx.showToast({ title: '请选择科室', icon: 'none' });
      return;
    }
    if (!doc || !doc.id) {
      wx.showToast({ title: '请选择医生', icon: 'none' });
      return;
    }
    if (!date) {
      wx.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    if (!slot) {
      wx.showToast({ title: '请选择时段', icon: 'none' });
      return;
    }
    const payload = {
      account_id,
      department_id: dep.id,
      doctor_id: doc.id,
      date,
      slot,
      regi_type: '普通号',
      // create as an appointment (候补) by default from booking page
      force_waitlist: true
    };
    try {
      // optional quick health check of backend root (helps surface network down vs service error)
      try {
        await request({ url: '/', method: 'GET' });
      } catch (probeErr) {
        // probe failed - show network message and abort submit
        console.warn('backend probe failed', probeErr);
        wx.showToast({ title: '无法连接后端服务，请检查服务是否已启动', icon: 'none' });
        return;
      }

      const res = await request({ url: '/api/registration/create', method: 'POST', data: payload });
      if (res && res.success) {
        wx.showToast({ title: '预约已提交', icon: 'success' });
        wx.navigateTo({ url: '/pages/appointment/appointment' });
      } else {
        const msg = (res && res.message) ? res.message : '提交失败';
        wx.showToast({ title: msg, icon: 'none' });
        console.warn('createRegistration failed', res);
      }
    } catch (err) {
      console.error('submit err', err);
      // try to extract server-provided message
      let message = '网络或服务错误';
      try {
        if (err && err.body && err.body.message) message = err.body.message;
        else if (err && err.body && typeof err.body === 'string') message = err.body;
        else if (err && err.error && err.error.errMsg) message = err.error.errMsg;
      } catch (e) { /* ignore */ }
      wx.showToast({ title: message, icon: 'none' });
    }
  }

});

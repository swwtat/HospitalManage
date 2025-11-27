// pages/appointment/appointment.js
const { request } = require('../../utils/request');
Page({
  data: {
    ordersList: [],
    loading: false,
    message: ''
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
    this.loadAppointments();
  },

  async loadAppointments() {
    const account_id = wx.getStorageSync('account_id');
    if (!account_id) {
      this.setData({ message: '请先登录', ordersList: [] });
      return;
    }
    this.setData({ loading: true, message: '' });
    try {
      const res = await request({ url: `/api/registration/list/${account_id}`, method: 'GET' });
      if (!res || !res.success) {
        this.setData({ message: '无法加载预约', loading: false });
        return;
      }
      // keep only appointment (候补) orders here — rely on status === 'waiting' (is_waitlist flag may persist after cancel)
      const orders = (res.data || []).filter(o => o.status === 'waiting');

      // classify orders
      const today = new Date();
      const todayStr = today.toISOString().slice(0,10);

      // For each order compute status and availability, then build a single sorted list
      const pairs = {};
      const doctorIds = new Set();
      for (const o of orders) {
        const orderDate = String(o.date || '').slice(0,10);
        if (!orderDate) continue;
        const key = `${o.doctor_id}::${orderDate}`;
        pairs[key] = pairs[key] || { doctor_id: o.doctor_id, date: orderDate, orders: [] };
        pairs[key].orders.push(o);
        if (o.doctor_id) doctorIds.add(o.doctor_id);
      }

      const availCache = {};
      const doctorCache = {};
      let deptMap = {};

      // fetch doctor info
      await Promise.all(Array.from(doctorIds).map(async id => {
        try {
          const r = await request({ url: `/api/doctor/${id}`, method: 'GET' });
          if (r && r.success) doctorCache[id] = r.data;
        } catch (e) {}
      }));

      // fetch departments once and build id->name map
      try {
        const depRes = await request({ url: '/api/departments', method: 'GET' });
        if (depRes && depRes.success) {
          const flatten = [];
          (depRes.data || []).forEach(p => {
            flatten.push({ id: p.id, name: p.name });
            if (p.children && p.children.length) {
              p.children.forEach(c => flatten.push({ id: c.id, name: c.name }));
            }
          });
          deptMap = flatten.reduce((m, d) => { m[d.id] = d.name; return m; }, {});
        }
      } catch (e) { /* ignore */ }

      // fetch availability per pair
      await Promise.all(Object.keys(pairs).map(async k => {
        const p = pairs[k];
        try {
          const r = await request({ url: `/api/doctor/${p.doctor_id}/availability?date=${p.date}`, method: 'GET' });
          availCache[k] = (r && r.success) ? r.data || [] : [];
        } catch (e) { availCache[k] = []; }
      }));

      const list = [];
      // helper for slot ordering
      const slotOrder = { '8-10': 1, '10-12': 2, '14-16': 3, '16-18': 4 };

      for (const key of Object.keys(pairs)) {
        const p = pairs[key];
        const availRows = availCache[key] || [];
        for (const o of p.orders) {
          const slotRow = availRows.find(r => r.slot === o.slot) || availRows[0] || null;
          const available = slotRow ? (parseInt(slotRow.capacity||0,10) - parseInt(slotRow.booked||0,10) > 0) : false;
          // status: expired | available | reserved
          const orderDate = String(o.date || '').slice(0,10);
          let status = 'reserved';
          if (orderDate < todayStr) {
            status = 'expired';
          } else {
            // only waiting/candidate orders should be shown as 'available' when there's capacity
            if ((o.status === 'waiting' || o.is_waitlist) && available) {
              status = 'available';
            } else if (o.status === 'confirmed') {
              status = 'reserved';
            } else {
              status = 'reserved';
            }
          }
          const doc = doctorCache[o.doctor_id] || { id: o.doctor_id, name: `医生#${o.doctor_id}` };
          // attach department name if available
          if (doc && doc.department_id && deptMap && deptMap[doc.department_id]) {
            doc.department_name = deptMap[doc.department_id];
          }
          const item = Object.assign({}, o, {
            doctor: doc,
            available,
            status,
            sort_key: `${orderDate}::${slotOrder[o.slot] || 99}::${o.created_at || ''}`
          });
          list.push(item);
        }
      }

      // sort by date then slot
      list.sort((a,b) => a.sort_key < b.sort_key ? -1 : (a.sort_key > b.sort_key ? 1 : 0));

      // Show all waiting appointments, but each item has `available` flag
      this.setData({ ordersList: list, loading: false });
    } catch (err) {
      console.error('loadAppointments err', err);
      this.setData({ message: '网络或服务错误', loading: false });
    }
  },

  // user clicks 去挂号 on an alerted appointment
  onGoRegister(e) {
    const orderId = e.currentTarget.dataset.orderid;
    const order = (this.data.ordersList || []).find(x => String(x.id) === String(orderId));
    if (!order) return;
    // prefill register page via storage
    wx.setStorageSync('selectedDoctor', { id: order.doctor_id, name: order.doctor && order.doctor.name ? order.doctor.name : `医生#${order.doctor_id}` });
    wx.setStorageSync('selectedDate', String(order.date).slice(0,10));
    wx.setStorageSync('selectedSlot', order.slot);
    wx.navigateTo({ url: '/pages/register/register' });
  },

  // view details -> navigate to orders list
  onViewOrder(e) {
    // Deprecated for appointment view page — noop
    return;
  },

  // cancel appointment (same as orders cancel)
  async onCancel(e) {
    const orderId = e.currentTarget.dataset.orderid;
    if (!orderId) return;
    // Optimistic UI: remove the appointment immediately from the list
    const list = Array.isArray(this.data.ordersList) ? this.data.ordersList.slice() : [];
    const idx = list.findIndex(x => String(x.id) === String(orderId));
    let removed = null;
    if (idx >= 0) {
      removed = list.splice(idx, 1)[0];
      this.setData({ ordersList: list });
    }

    try {
      const res = await request({ url: '/api/registration/cancel', method: 'POST', data: { order_id: orderId } });
      if (res && res.success) {
        wx.showToast({ title: '已取消', icon: 'success' });
      } else {
        // restore on failure
        if (removed) {
          list.splice(idx, 0, removed);
          this.setData({ ordersList: list });
        }
        wx.showToast({ title: (res && res.message) ? res.message : '取消失败', icon: 'none' });
      }
    } catch (err) {
      console.error('cancel err', err);
      if (removed) {
        list.splice(idx, 0, removed);
        this.setData({ ordersList: list });
      }
      wx.showToast({ title: '网络或服务错误', icon: 'none' });
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
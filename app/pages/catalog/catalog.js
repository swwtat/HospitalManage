// pages/catalog/catalog.js
Page({
  data: {
    userRole: '', // 'patient' 或 'doctor'
    isLoggedIn: false,
    
    // 患者端功能列表
    patientPages: [
      { id: 'register', name: '挂号预约', icon: '📋', desc: '科室选择和医生预约', page: '/pages/register/register' },
      { id: 'docProfile', name: '医生查询', icon: '👨‍⚕️', desc: '查看医生信息和排班', page: '/pages/docProfile/docProfile' },
      { id: 'appointment', name: '我的预约', icon: '📅', desc: '查看和管理预约信息', page: '/pages/appointment/appointment' },
      { id: 'orders', name: '订单管理', icon: '🛒', desc: '查看挂号费用和订单', page: '/pages/orders/orders' },
      { id: 'payment', name: '费用支付', icon: '💳', desc: '处理挂号和医疗费用支付', page: '/pages/payment/payment' },
      { id: 'info', name: '个人信息', icon: '👤', desc: '管理个人资料和健康档案', page: '/pages/info/info' },
      { id: 'accountRegister', name: '用户注册', icon: '✍️', desc: '完成新用户账户注册流程', page: '/pages/accountRegister/accountRegister' },
      // 统一将日志/记录功能归类到其他，这里只保留核心功能
    ],
    
    // 医生端功能列表
    doctorPages: [
      { id: 'docIndex', name: '工作台首页', icon: '🏠', desc: '医生工作台主页', page: '/pages/docIndex/docIndex' },
      { id: 'docInfo', name: '个人资料', icon: '👤', desc: '编辑个人信息和执业资料', page: '/pages/docInfo/docInfo' },
      { id: 'docShift', name: '排班管理', icon: '⏱️', desc: '设置出诊日期和时间', page: '/pages/docShift/docShift' },
      { id: 'docAbsence', name: '请假申请', icon: '🚫', desc: '提交休息和请假申请', page: '/pages/docAbsence/docAbsence' },
      { id: 'docAccount', name: '账户管理', icon: '💼', desc: '管理账户和结算信息', page: '/pages/docAccount/docAccount' },
      // 登录和注册入口通常放在共享模块，这里移除重复项
    ],

    // 共享和通用功能
    sharedPages: [
        { id: 'login', name: '用户登录', icon: '🔓', desc: '进入患者账户登录界面', page: '/pages/login/login' },
        { id: 'docLogin', name: '医生登录', icon: '🔐', desc: '进入医生账户登录界面', page: '/pages/docLogin/docLogin' },
        { id: 'profile', name: '个人中心', icon: '👁️', desc: '统一的个人信息和设置中心', page: '/pages/profile/profile' },
        { id: 'setting', name: '系统设置', icon: '⚙️', desc: '应用偏好和系统设置', page: '/pages/setting/setting' },
        { id: 'aiChat', name: 'AI 助手', icon: '🤖', desc: '智能咨询与健康问答', page: '/pages/aiChat/aiChat' },
    ]
  },

  /**
   * 检查用户角色和登录状态
   * 核心逻辑，用于在 onShow 和下拉刷新时更新视图
   */
  checkUserRole() {
    const token = wx.getStorageSync('token'); // 患者 token
    const docToken = wx.getStorageSync('docToken'); // 医生 token

    let userRole = '';
    let isLoggedIn = false;

    if (docToken) {
      userRole = 'doctor';
      isLoggedIn = true;
    } else if (token) {
      userRole = 'patient';
      isLoggedIn = true;
    }

    this.setData({
      userRole,
      isLoggedIn,
    });
    
    console.log(`[Catalog] Role: ${userRole}, Logged: ${isLoggedIn}`);
  },

  // 导航跳转处理
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.vibrateShort({ type: 'light' }); // 增加触感反馈
    
    if (!url) {
      wx.showToast({
        title: '页面地址错误',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: url,
      fail: (err) => {
        wx.showToast({
          title: '跳转失败，请检查路径',
          icon: 'none'
        });
        console.error('Navigation error:', err);
      }
    });
  },

  // --- 小程序生命周期函数 ---
  onLoad() {
    this.checkUserRole();
  },

  onShow() {
    this.checkUserRole();
  },

  onPullDownRefresh() {
    this.checkUserRole();
    wx.stopPullDownRefresh();
  },
  
  // 仅保留常用的生命周期函数，移除 onReady, onHide, onUnload, onReachBottom
  onShareAppMessage() {
    return {
      title: '校医院小程序 - 功能导航',
      path: '/pages/catalog/catalog'
    };
  }
});
// utils/request.js
const BASE_URL = (typeof __wxConfigBaseUrl !== 'undefined') ? __wxConfigBaseUrl : "http://localhost:3000";

/**
 * 通用请求方法，统一后端返回的 success/错误结构
 * options: { url, method, data, headers }
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 自动附带 token（若有）
    const token = wx.getStorageSync('token');
    const defaultHeaders = { 'Content-Type': 'application/json' };
    if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: Object.assign(defaultHeaders, options.headers || {}),
      success(res) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
          // 约定后端返回 { success: boolean, data?, message? }
          if (res.data && res.data.success === false) {
            return reject({ code: res.statusCode, body: res.data });
          }
          return resolve(res.data);
        }
        return reject({ code: res.statusCode, body: res.data || res });
      },
      fail(err) {
        return reject({ code: 0, error: err });
      }
    });
  });
};

module.exports = { request, BASE_URL };

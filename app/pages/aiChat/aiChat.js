// pages/aiChat/aiChat.js
const request = require('../../utils/request');
Page({

  data: {
    messages: [
      {
        id: 'welcome-' + Date.now(),
        type: 'bot',
        content: '👋 欢迎使用医院智能助手！我是您的医疗顾问，可以帮助您：\n• 了解挂号流程\n• 查看医生信息\n• 填写挂号表单\n• 提供健康建议\n\n请告诉我您今天需要什么帮助？',
        timestamp: new Date().toLocaleTimeString(),
        actions: []
      }
    ],
    inputValue: '',
    isLoading: false,
    conversationContext: [],
    suggestions: [],
    scrollToBottom: true,
    inputHeight: 40
  },

  onLoad() {
    this.loadSuggestions();
  },

  loadSuggestions() {
    request.get('/api/ai/suggestions', {
      success: (res) => {
        if (res.data && res.data.data) {
          this.setData({ suggestions: res.data.data });
        }
      },
      fail: (err) => {
        console.error('Failed to load suggestions:', err);
        this.setData({
          suggestions: [
            { label: '我要挂号', icon: '📋', message: '我想进行挂号预约' },
            { label: '查看医生', icon: '👨‍⚕️', message: '我想查看医生信息' },
            { label: '查看预约', icon: '📅', message: '我想查看预约记录' },
            { label: '支付费用', icon: '💳', message: '我需要支付费用' }
          ]
        });
      }
    });
  },

  onInputChange(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onInputHeightChange(e) {
    this.setData({ inputHeight: Math.max(40, Math.min(e.detail.height, 100)) });
  },

  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    this.setData({ inputValue: '' });

    const userMsg = {
      id: 'user-' + Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      actions: []
    };

    const messages = this.data.messages.concat(userMsg);
    this.setData({ messages }, this.scrollToBottomSmooth);

    this.fetchAIResponse(message, messages);
  },

  sendSuggestion(e) {
    let suggestion = e.currentTarget.dataset.item;
    if (typeof suggestion === 'string') {
      try { suggestion = JSON.parse(suggestion); } catch (e) { /* ignore */ }
    }
    const msg = (suggestion && suggestion.message) ? suggestion.message : (suggestion || '');
    this.setData({ inputValue: msg }, () => {
      this.sendMessage();
    });
  },

  fetchAIResponse(message, messages) {
    this.setData({ isLoading: true });

    const context = this.data.conversationContext.concat([
      { role: 'user', content: message }
    ]);

    request.post('/api/ai/chat', {
      message: message,
      conversationContext: context
    }, {
      success: (res) => {
        if (res.data && res.data.code === 200) {
          const aiData = res.data.data;
          
          const botMsg = {
            id: 'bot-' + Date.now(),
            type: 'bot',
            content: aiData.reply,
            timestamp: new Date().toLocaleTimeString(),
            actions: aiData.actions || []
          };

          const updatedMessages = messages.concat(botMsg);
          const updatedContext = context.concat([
            { role: 'assistant', content: aiData.reply }
          ]);

          this.setData({
            messages: updatedMessages,
            conversationContext: updatedContext,
            isLoading: false,
            suggestions: aiData.suggestions || this.data.suggestions
          }, this.scrollToBottomSmooth);
        } else {
          this.showErrorMessage(res.data?.msg || 'AI 服务异常');
        }
      },
      fail: (err) => {
        console.error('AI request failed:', err);
        this.showErrorMessage('请求失败，请检查网络连接');
      }
    });
  },

  showErrorMessage(errorMsg) {
    const errorBotMsg = {
      id: 'bot-' + Date.now(),
      type: 'bot',
      content: '❌ ' + errorMsg,
      timestamp: new Date().toLocaleTimeString(),
      actions: []
    };

    this.setData({
      messages: this.data.messages.concat(errorBotMsg),
      isLoading: false
    }, this.scrollToBottomSmooth);
  },

  handleAction(e) {
    let action = e.currentTarget.dataset.action;
    if (typeof action === 'string') {
      try { action = JSON.parse(action); } catch (err) { /* ignore */ }
    }
    if (!action) return;

    if (action.type === 'navigate') {
      wx.navigateTo({
        url: action.url,
        fail: (err) => {
          wx.showToast({
            title: '页面不存在',
            icon: 'none'
          });
        }
      });
    } else if (action.type === 'fillForm') {
      wx.setStorageSync('aiFormData', action.formData);
      wx.navigateTo({
        url: '/pages/register/register',
        fail: (err) => {
          wx.showToast({
            title: '无法跳转到挂号页面',
            icon: 'none'
          });
        }
      });
    }
  },

  scrollToBottomSmooth() {
    wx.nextTick(() => {
      this.setData({ scrollToBottom: false });
      wx.nextTick(() => {
        this.setData({ scrollToBottom: true });
      });
    });
  },

  clearChat() {
    wx.showModal({
      title: '清空聊天记录',
      content: '确定要清空所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [
              {
                id: 'welcome-' + Date.now(),
                type: 'bot',
                content: '👋 欢迎使用医院智能助手！有什么我可以帮助您的吗？',
                timestamp: new Date().toLocaleTimeString(),
                actions: []
              }
            ],
            conversationContext: []
          });
        }
      }
    });
  },

  onReady() {
    this.scrollToBottomSmooth();
  },

  onShow() {
    this.loadSuggestions();
  },

  onHide() {},
  onUnload() {},
  onPullDownRefresh() {
    this.loadSuggestions();
    wx.stopPullDownRefresh();
  },
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: '医院智能助手',
      path: '/pages/aiChat/aiChat'
    };
  }
});
const mq = require('../mq');

exports.publishTest = async (req, res) => {
  try {
    const { event = 'order.test', data = {} } = req.body || {};
    await mq.publish(event, { event, data, ts: Date.now() });
    res.json({ success: true, message: 'published', event });
  } catch (err) {
    console.error('MQ publish error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.status = async (req, res) => {
  try {
    // 返回基本的 MQ 连接信息（不暴露敏感信息）
    res.json({ success: true, data: { connected: !!mq } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

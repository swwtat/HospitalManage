const mq = require('./index');

// 简单的发布带确认与重试机制
const DEFAULT_RETRIES = parseInt(process.env.MQ_PUBLISH_RETRIES || '3');
const BASE_DELAY_MS = 200; // 指数退避基数

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function publishOrderEvent(eventType, data, opts = {}) {
  const routingKey = `order.${eventType}`; // e.g. order.created
  const payload = { event: routingKey, data, ts: Date.now() };
  const retries = typeof opts.retries === 'number' ? opts.retries : DEFAULT_RETRIES;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await mq.publish(routingKey, payload, { persistent: true });
      console.log('Published MQ event', routingKey);
      return true;
    } catch (err) {
      const last = attempt === retries;
      console.warn(`MQ publish attempt ${attempt + 1}/${retries + 1} failed for ${routingKey}:`, err.message);
      if (last) {
        console.error('MQ publish finally failed', err);
        throw err;
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      await wait(delay);
    }
  }
}

module.exports = { publishOrderEvent };

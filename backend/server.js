const app = require('./app');
const mq = require('./mq');
const orderSubscriber = require('./mq/subscriber');
const adminService = require('./services/adminService');
const path = require('path');

const port = process.env.PORT || 3000;
const ip = '0.0.0.0';

// 启动过程：优先初始化 MQ 连接并注册基础订阅，然后启动 HTTP 服务
(async () => {
  try {
    // Ensure auxiliary admin tables exist before starting
    try {
      await adminService.ensureTables();
      console.log('Admin auxiliary tables ensured');
    } catch (tblErr) {
      console.warn('Failed to ensure admin tables', tblErr.message);
    }

    await mq.connect();

    // 注册一个通用的订单事件订阅（示例：只是打印并为后续扩展预留挂钩）
    try {
      await orderSubscriber.registerOrderSubscriber('order.#', async (body, meta) => {
        console.log('Received MQ event', meta.routingKey, body);
      });
      console.log('Order subscriber registered for order.#');
    } catch (subErr) {
      console.warn('Failed to register order subscriber', subErr.message);
    }

    // 初始化示例消费者：通知服务（写入 notifications 表）
    try {
      const notificationConsumer = require('./consumers/notificationConsumer');
      await notificationConsumer.init();
    } catch (ncErr) {
      console.warn('Failed to init notification consumer', ncErr.message);
    }

    app.listen(port, ip, () => {
      console.log(`The Server running on http://${ip}:${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize MQ or start server', err);
    process.exit(1);
  }
})();

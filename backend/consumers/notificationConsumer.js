const orderSubscriber = require('../mq/subscriber');
const db = require('../db');

function mapEventToNotificationType(routingKey) {
  switch (routingKey) {
    case 'order.created': return 'appointment_created';
    case 'order.waiting': return 'waitlist_entered';
    case 'order.promoted': return 'waitlist_promoted';
    case 'order.cancelled': return 'appointment_cancelled';
    default: return 'order_event';
  }
}

async function handleOrderEvent(body, meta) {
  try {
    const routingKey = meta.routingKey || (body && body.event) || 'order.unknown';
    const data = body && body.data ? body.data : {};
    const accountId = data.account_id || data.accountId || null;

    // 如果没有 account_id，则可能无法发送用户通知，但仍可写入审计/通知表（account_id 必填，跳过）
    if (!accountId) {
      console.warn('Order event missing account_id, skipping notification insert', routingKey, data);
      return;
    }

    const eventType = mapEventToNotificationType(routingKey);
    const payload = JSON.stringify({ routingKey, data });
    await db.query('INSERT INTO notifications (account_id, event_type, payload) VALUES (?, ?, ?)', [accountId, eventType, payload]);
    console.log('Inserted notification for account', accountId, 'event', eventType);
  } catch (err) {
    console.error('notificationConsumer error', err.message);
    throw err; // 让订阅端 nack
  }
}

async function init() {
  // 注册对 order.* 的订阅
  await orderSubscriber.registerOrderSubscriber('order.#', handleOrderEvent);
  console.log('notificationConsumer initialized and subscribed to order.#');
}

module.exports = { init };

const mq = require('./index');

/**
 * registerOrderSubscriber(handler)
 * handler(body, meta) => Promise
 * bindingKey supports topic patterns, e.g. 'order.#' or 'order.created'
 */
async function registerOrderSubscriber(bindingKey, handler) {
  await mq.connect();
  const queue = await mq.ensureQueue('', { exclusive: true });
  // use subscribe helper which creates anonymous queue and binds
  return mq.subscribe(bindingKey, handler, { noAck: false });
}

module.exports = { registerOrderSubscriber };

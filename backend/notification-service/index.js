const mq = require('./mqClient');
const processor = require('./processor');

// Try to connect to MQ with retry/backoff until successful
async function connectWithRetry(maxAttempts = Infinity) {
  const BASE_DELAY_MS = parseInt(process.env.MQ_RETRY_BASE_MS || '1000');
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      await mq.connect();
      console.log('Connected to MQ after', attempt, 'attempt(s)');
      return;
    } catch (err) {
      const delay = BASE_DELAY_MS * Math.min(Math.pow(2, attempt - 1), 30);
      console.warn(`MQ connect attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Failed to connect to MQ after max attempts');
}

async function start() {
  console.log('Notification service starting...');

  // Ensure MQ is reachable before subscribing; keep retrying indefinitely by default
  await connectWithRetry();

  // Subscribe to relevant event topics
  const bindings = ['appointment.*', 'waitlist.*', 'visit.*'];

  for (const b of bindings) {
    try {
      await mq.subscribe(b, async (body, meta) => {
        try {
          console.log('Received event', meta.routingKey, body.event || body.type || '');
          await processor.processEvent(meta.routingKey || body.event || body.type, body.data || body.payload || body);
        } catch (err) {
          console.error('Processor error', err);
        }
      });
      console.log('Subscribed to', b);
    } catch (err) {
      console.error('Failed to subscribe', b, err.message);
    }
  }

  // graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down notification service...');
    try { await mq.close(); } catch (e) {}
    process.exit(0);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection in notification-service:', reason);
  });
}

start();

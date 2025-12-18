// Vercel serverless entry for the Express app
// Export the express `app` directly so Vercel's Node runtime can invoke it.
// IMPORTANT: Do NOT initialize long-running background services (MQ subscribers) here.

const app = require('./app');

module.exports = app;

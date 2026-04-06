const { Redis } = require('ioredis');
require('dotenv').config();

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),
  lazyConnect: true,
  connectTimeout: 5000,
  // Stop retrying after 5 failed attempts so the server doesn't hang
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 5) {
      console.warn('[Redis] Max reconnection attempts reached. Running without Redis.');
      return null; // stop retrying
    }
    return Math.min(times * 500, 3000);
  },
  // Drop commands immediately if not connected (no offline queue buildup)
  enableOfflineQueue: false,
});

redis.on('error', (err) => {
  // Only log once — ioredis will keep emitting; suppress repeated msgs
  if (!redis._loggedError) {
    console.warn('[Redis] Unavailable — enhancement queuing disabled. Start Redis to enable it.');
    redis._loggedError = true;
  }
});

redis.on('connect', () => {
  redis._loggedError = false;
  console.log('[Redis] Connected successfully.');
});

redis.on('end', () => {
  console.warn('[Redis] Connection closed.');
});

module.exports = redis;

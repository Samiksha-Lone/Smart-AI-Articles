const { Redis } = require('ioredis');
require('dotenv').config();

const createRedisConnection = () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB || 0),
    lazyConnect: true,
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 5) {
        return null;
      }
      return Math.min(times * 500, 3000);
    },
    enableOfflineQueue: false,
  });

  redis.on('error', (err) => {
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

  return redis;
};

module.exports = createRedisConnection;

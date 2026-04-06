const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const articleEnhancementQueue = new Queue('article-enhancement', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 30000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = articleEnhancementQueue;

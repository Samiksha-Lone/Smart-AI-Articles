const { Queue } = require('bullmq');
const createRedisConnection = require('../config/redis');

let articleEnhancementQueue;

const getArticleEnhancementQueue = () => {
  if (!articleEnhancementQueue) {
    const connection = createRedisConnection();
    articleEnhancementQueue = new Queue('article-enhancement', {
      connection,
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
  }
  return articleEnhancementQueue;
};

module.exports = { getArticleEnhancementQueue };

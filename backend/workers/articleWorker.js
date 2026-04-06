require('dotenv').config();
const mongoose = require('mongoose');
const { Worker, QueueScheduler } = require('bullmq');
const createRedisConnection = require('../config/redis');
const Article = require('../models/Article');
const { enhanceContent } = require('../services/aiService');

const queueName = 'article-enhancement';
const redisConnection = createRedisConnection();
new QueueScheduler(queueName, { connection: redisConnection });

const connectToMongo = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required for worker');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });

  mongoose.connection.on('error', (err) => {
    console.error('[Worker] MongoDB connection error:', err);
  });

  mongoose.connection.once('open', () => {
    console.log('[Worker] MongoDB connected successfully');
  });
};

const runWorker = async () => {
  await connectToMongo();

  const worker = new Worker(
    queueName,
    async (job) => {
      const { articleId } = job.data;
      if (!articleId) {
        throw new Error('Job payload missing articleId');
      }

      const article = await Article.findById(articleId);
      if (!article) {
        throw new Error(`Article not found: ${articleId}`);
      }

      if (!article.content || !article.content.trim()) {
        throw new Error('Article has no content to enhance');
      }

      const enhancedData = await enhanceContent(article.content, article.title, {
        writingStyle: article.writingStyle,
        tone: article.tone,
        template: article.template
      });

      if (job.data.isRegeneration) {
        article.title = enhancedData.enhancedTitle || article.title;
        article.enhancedContent = enhancedData.enhancedContent;
        // Update content and excerpt so the frontend cards show the new regenerated text
        article.content = enhancedData.enhancedContent;
        article.excerpt = enhancedData.summary || enhancedData.enhancedContent.slice(0, 200);
        article.analytics = enhancedData.analytics;
        article.status = 'completed';
        article.enhancedAt = new Date();
        article.updatedAt = new Date();
        await article.save();
      } else {
        const enhanced = new Article({
          title: enhancedData.enhancedTitle || article.title,
          content: enhancedData.enhancedContent,
          excerpt: enhancedData.summary || enhancedData.enhancedContent.slice(0, 200),
          url: article.url,
          user: article.user,
          original: false,
          enhancedContent: enhancedData.enhancedContent,
          analytics: enhancedData.analytics,
          status: 'completed',
          enhancedAt: new Date(),
        });
        await enhanced.save();

        article.status = 'completed';
        article.updatedAt = new Date();
        await article.save();
      }

      return {
        articleId,
        status: article.status,
      };
    },
    {
      connection: redisConnection,
      concurrency: 1,
    }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed for article ${job.data.articleId}`);
  });

  worker.on('failed', async (job, err) => {
    const articleId = job.data?.articleId;
    console.error(`[Worker] Job ${job.id} failed for article ${articleId}:`, err.message);

    try {
      if (articleId && job.attemptsMade >= (job.opts?.attempts || 1)) {
        await Article.findByIdAndUpdate(
          articleId,
          {
            status: 'failed',
            failureReason: err.message,
            updatedAt: new Date(),
          },
          { new: true }
        );
        console.error(`[Worker] Article ${articleId} marked as failed after ${job.attemptsMade} attempts.`);
      }
    } catch (updateError) {
      console.error('[Worker] Failed to update article status after job failure:', updateError.message);
    }
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err);
  });
};

runWorker().catch((error) => {
  console.error('[Worker] Fatal error while starting worker:', error);
  process.exit(1);
});

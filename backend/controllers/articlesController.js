const Article = require('../models/Article');
const { getArticleEnhancementQueue } = require('../queues/articleQueue');
const { enhanceContent } = require('../services/aiService');
const logger = require('../services/loggerService');

const sanitizeUrl = (url) => {
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  return trimmed === '' ? undefined : trimmed;
};

const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // 'pending', 'processing', 'completed', 'failed'
    const original = req.query.original; // 'true' or 'false'

    const query = { user: req.userId };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add original filter
    if (original !== undefined) {
      query.original = original === 'true';
    }

    const skip = (page - 1) * limit;

    const articles = await Article.find(query)
      .sort({ date: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    await logger.error('Failed to fetch articles', { error: error.message, userId: req.userId });
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id, user: req.userId });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const articleData = {
      title: req.body.title,
      content: req.body.content,
      url: sanitizeUrl(req.body.url),
      excerpt: req.body.excerpt,
      image: req.body.image,
      original: req.body.original,
      template: req.body.template,
      writingStyle: req.body.writingStyle,
      tone: req.body.tone,
      user: req.userId,
      status: 'pending',
      enhancedContent: undefined,
      failureReason: undefined,
      versions: [{
        content: req.body.content,
        version: 1,
        createdAt: new Date()
      }]
    };

    if (articleData.url === undefined) {
      delete articleData.url;
    }

    const article = new Article(articleData);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error('[Articles Controller] createArticle error:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate value conflict. Please change the URL or leave it blank.',
        details: error.keyValue
      });
    }
    res.status(500).json({
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : null
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      url: sanitizeUrl(req.body.url),
      updatedAt: new Date()
    };

    if (updates.url === undefined) {
      delete updates.url;
    }

    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const enhanceArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id, user: req.userId });
    if (!article) {
      return res.status(404).json({ message: 'Article not found', error: 'Article not found' });
    }

    if (article.status === 'processing') {
      return res.status(409).json({
        message: 'Enhancement already in progress for this article',
        status: article.status
      });
    }

    // Mark as processing
    article.status = 'processing';
    article.failureReason = undefined;
    await article.save();

    // ── Try queue first (Redis path) ──────────────────────
    let queuedSuccessfully = false;
    try {
      const queue = getArticleEnhancementQueue();
      await queue.add(
        `enhance-article-${article._id}`,
        { articleId: article._id.toString() },
        {
          jobId: `article-${article._id}`,
          removeOnComplete: true,
          attempts: 3,
          backoff: { type: 'exponential', delay: 30000 },
        }
      );
      queuedSuccessfully = true;
    } catch (queueError) {
      console.warn('[Articles Controller] Queue unavailable, falling back to direct enhancement:', queueError.message);
    }

    if (queuedSuccessfully) {
      return res.json({ message: 'Enhancement queued', status: article.status, articleId: article._id });
    }

    // ── Fallback: call AI service directly (no Redis needed) ──
    try {
      console.log(`[Articles Controller] Direct enhancement for article ${article._id}`);
      const enhancedData = await enhanceContent(article.content, article.title);

      // Create a new enhanced article document (mirrors worker behaviour)
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

      // Mark original as completed
      article.status = 'completed';
      await article.save();

      return res.json({ message: 'Enhancement completed', status: 'completed', articleId: article._id });
    } catch (aiError) {
      article.status = 'failed';
      article.failureReason = aiError.message;
      await article.save();
      console.error('[Articles Controller] Direct enhancement failed:', aiError.message);
      return res.status(503).json({
        message: 'AI enhancement failed',
        error: aiError.message
      });
    }

  } catch (error) {
    console.error('[Articles Controller] Enhancement error:', error);
    res.status(500).json({ message: 'Error enhancing article', error: error.message });
  }
};

// Phase 5: Analytics Dashboard
const getAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get total articles count
    const totalArticles = await Article.countDocuments({ user: userId });

    // Get completed articles for scoring
    const completedArticles = await Article.find({
      user: userId,
      status: 'completed',
      'analytics.aiScores': { $exists: true }
    });

    // Calculate averages
    let avgReadability = 0;
    let avgEngagement = 0;
    let avgSEO = 0;

    if (completedArticles.length > 0) {
      const scores = completedArticles.map(article => article.analytics.aiScores);
      avgReadability = scores.reduce((sum, score) => sum + (score.readability || 0), 0) / scores.length;
      avgEngagement = scores.reduce((sum, score) => sum + (score.engagement || 0), 0) / scores.length;
      avgSEO = scores.reduce((sum, score) => sum + (score.seo || 0), 0) / scores.length;
    }

    // Get last generated article
    const lastArticle = await Article.findOne({ user: userId })
      .sort({ enhancedAt: -1 })
      .select('title enhancedAt status');

    // Separate counts for the sidebar mapping
    const totalOriginals = await Article.countDocuments({ user: userId, original: true });
    const totalEnhanced = await Article.countDocuments({ user: userId, original: false });
    const totalProcessing = await Article.countDocuments({ user: userId, status: 'processing' });

    res.json({
      totalArticles,
      totalOriginals,
      totalEnhanced,
      totalProcessing,
      averageScores: {
        readability: Math.round(avgReadability),
        engagement: Math.round(avgEngagement),
        seo: Math.round(avgSEO)
      },
      lastArticle: lastArticle ? {
        title: lastArticle.title,
        date: lastArticle.enhancedAt,
        status: lastArticle.status
      } : null
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    await logger.error('Failed to fetch analytics', { error: error.message, userId: req.userId });
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Phase 5: Regenerate Article (creates new version)
const regenerateArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id, user: req.userId });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Save current version before regenerating
    const currentVersion = {
      content: article.content,
      enhancedContent: article.enhancedContent,
      analytics: article.analytics,
      version: article.versions.length + 1,
      createdAt: new Date()
    };

    article.versions.push(currentVersion);

    // Reset for new enhancement
    article.status = 'processing';
    article.enhancedContent = undefined;
    article.analytics = undefined;
    article.enhancedAt = undefined;
    article.failureReason = undefined;

    await article.save();

    // Queue the enhancement
    try {
      const queue = getArticleEnhancementQueue();
      await queue.add(
        `regenerate-article-${article._id}`,
        { articleId: article._id.toString(), isRegeneration: true },
        {
          jobId: `regenerate-${article._id}`,
          removeOnComplete: true,
          attempts: 3,
          backoff: { type: 'exponential', delay: 30000 },
        }
      );
      return res.json({ message: 'Regeneration queued', status: 'processing', articleId: article._id });
    } catch (queueError) {
      // Fallback to direct enhancement
      try {
        const enhancedData = await enhanceContent(article.content, article.title);

        article.title = enhancedData.enhancedTitle || article.title;
        article.enhancedContent = enhancedData.enhancedContent;
        article.content = enhancedData.enhancedContent;
        article.excerpt = enhancedData.summary || enhancedData.enhancedContent.slice(0, 200);
        article.analytics = enhancedData.analytics;
        article.status = 'completed';
        article.enhancedAt = new Date();
        await article.save();
        return res.json({ message: 'Regeneration completed', status: 'completed', articleId: article._id });
      } catch (aiError) {
        article.status = 'failed';
        article.failureReason = aiError.message;
        await article.save();
        return res.status(503).json({ error: 'Regeneration failed', message: aiError.message });
      }
    }
  } catch (error) {
    console.error('Error regenerating article:', error);
    res.status(500).json({ error: error.message });
  }
};

// Phase 5: Export Article
const exportArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id, user: req.userId });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const exportData = {
      title: article.title,
      content: article.enhancedContent || article.content,
      template: article.template,
      writingStyle: article.writingStyle,
      tone: article.tone,
      analytics: article.analytics,
      exportedAt: new Date()
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting article:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  enhanceArticle,
  getAnalytics,
  regenerateArticle,
  exportArticle
};
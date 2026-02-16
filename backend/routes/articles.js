const express = require('express');
const Article = require('../models/Article');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: 1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', [
  body('title').isLength({ min: 5 }).trim().escape().withMessage('Title must be at least 5 chars'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 chars'),
  body('url').optional({ checkFalsy: true }).isURL().withMessage('Valid URL required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Validation failed'
      });
    }

    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : null 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/enhance', async (req, res) => {
  try {
    console.log(`[Articles Route] Starting enhancement for article: ${req.params.id}`);
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      console.log(`[Articles Route] Article not found: ${req.params.id}`);
      return res.status(404).json({ 
        message: 'Article not found',
        error: 'Article not found' 
      });
    }

    console.log(`[Articles Route] Found article with title: "${article.title}"`);
    console.log(`[Articles Route] Article content length: ${article.content.length}`);

    if (!article.content || article.content.trim().length === 0) {
      console.log(`[Articles Route] Article content is empty`);
      return res.status(400).json({ 
        message: 'Article content is empty',
        error: 'Cannot enhance article with empty content' 
      });
    }

    const { enhanceContent } = require('../services/aiService');
    console.log(`[Articles Route] Calling AI enhancement service...`);
    
    const aiResult = await enhanceContent(article.content, article.title);
    
    console.log(`[Articles Route] AI enhancement completed successfully`);
    console.log(`[Articles Route] Enhanced content length: ${aiResult.enhancedContent.length}`);

    const enhancedArticle = new Article({
      title: `${article.title} (AI Analyst Enhanced)`,
      content: aiResult.enhancedContent,
      original: false,
      url: article.url, 
      date: new Date(),
      analytics: aiResult.analytics,
      aiEnhanced: true
    });

    await enhancedArticle.save();
    console.log(`[Articles Route] Enhanced article saved with ID: ${enhancedArticle._id}`);
    
    res.status(201).json(enhancedArticle);

  } catch (error) {
    console.error(`[Articles Route] Error during enhancement: ${error.message}`);
    console.error(`[Articles Route] Error stack: ${error.stack}`);
    
    res.status(500).json({ 
      message: 'AI Enhancement failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

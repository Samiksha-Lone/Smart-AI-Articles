const express = require('express');
const Article = require('../models/Article');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// ✅ GET all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: 1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET single article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST new article (Phase 2 will use this)
router.post('/', [
  body('title').isLength({ min: 5 }).trim().escape().withMessage('Title must be at least 5 chars'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 chars'),
  body('url').isURL().withMessage('Valid URL required'),  // ← REQUIRED BY MONGODB
], async (req, res) => {
  try {
    // CHECK VALIDATION ERRORS FIRST
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
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT update article (Phase 2 updated versions)
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

// ✅ DELETE article
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

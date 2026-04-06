const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  enhanceArticle,
  getAnalytics,
  regenerateArticle,
  exportArticle
} = require('../controllers/articlesController');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', getArticles);

router.get('/:id', getArticleById);

router.post('/', [
  body('title').isLength({ min: 5 }).trim().escape().withMessage('Title must be at least 5 chars'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 chars'),
  body('url').optional({ checkFalsy: true }).isURL().withMessage('Valid URL required'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
}, createArticle);

router.put('/:id', updateArticle);

router.delete('/:id', deleteArticle);

// Apply rate limiting to enhancement (5 requests per minute)
router.post('/:id/enhance', rateLimiter(5, 60000), enhanceArticle);

// Phase 5: Analytics dashboard
router.get('/analytics/dashboard', getAnalytics);

// Phase 5: Regenerate article
router.post('/:id/regenerate', rateLimiter(3, 60000), regenerateArticle);

// Phase 5: Export article
router.get('/:id/export', exportArticle);

module.exports = router;

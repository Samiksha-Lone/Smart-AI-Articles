const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  content: { type: String, required: true },
  url: { type: String },
  excerpt: String,
  date: { type: Date, default: Date.now, index: true },
  image: String,
  original: { type: Boolean, default: true },
  references: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  enhancedContent: String,
  enhancedAt: Date,
  failureReason: String,

  // Phase 5: Templates and Personalization
  template: {
    type: String,
    enum: ['blog', 'linkedin', 'email', 'custom'],
    default: 'custom'
  },
  writingStyle: {
    type: String,
    enum: ['formal', 'casual'],
    default: 'formal'
  },
  tone: {
    type: String,
    enum: ['professional', 'friendly', 'enthusiastic'],
    default: 'professional'
  },

  // Phase 5: Versioning System
  versions: [{
    content: String,
    enhancedContent: String,
    analytics: {
      sentiment: String,
      tone: String,
      readabilityScore: Number,
      readingEase: String,
      keywords: [String],
      entities: {
        people: [String],
        organizations: [String],
        locations: [String]
      },
      aiScores: {
        readability: { type: Number, min: 0, max: 100 },
        engagement: { type: Number, min: 0, max: 100 },
        seo: { type: Number, min: 0, max: 100 },
        wordCount: Number,
        sentenceCount: Number,
        avgSentenceLength: Number
      },
      suggestions: [{
        type: { type: String, enum: ['sentence', 'word', 'structure'] },
        message: String,
        position: Number,
        severity: { type: String, enum: ['low', 'medium', 'high'] }
      }],
      keywordAnalysis: {
        topKeywords: [{ word: String, count: Number }],
        missingKeywords: [String],
        keywordDensity: Number
      }
    },
    createdAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 }
  }],

  analytics: {
    sentiment: String,
    tone: String,
    readabilityScore: Number,
    readingEase: String,
    keywords: [String],
    entities: {
      people: [String],
      organizations: [String],
      locations: [String]
    },
    // Phase 3 AI Intelligence additions
    aiScores: {
      readability: { type: Number, min: 0, max: 100 },
      engagement: { type: Number, min: 0, max: 100 },
      seo: { type: Number, min: 0, max: 100 },
      wordCount: Number,
      sentenceCount: Number,
      avgSentenceLength: Number
    },
    suggestions: [{
      type: { type: String, enum: ['sentence', 'word', 'structure'] },
      message: String,
      position: Number, // character position in content
      severity: { type: String, enum: ['low', 'medium', 'high'] }
    }],
    keywordAnalysis: {
      topKeywords: [{ word: String, count: Number }],
      missingKeywords: [String],
      keywordDensity: Number
    }
  },
  updatedAt: { type: Date, default: Date.now }
}, {
  writeConcern: { w: 1, wtimeout: 5000 } 
});

module.exports = mongoose.model('Article', articleSchema);

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
    }
  },
  updatedAt: { type: Date, default: Date.now }
}, {
  writeConcern: { w: 1, wtimeout: 5000 } 
});

module.exports = mongoose.model('Article', articleSchema);

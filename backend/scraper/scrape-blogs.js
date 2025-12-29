const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Article = require('../models/Article');

async function scrapeBeyondChats() {
  try {
    // DON'T connect here - use existing connection
    await mongoose.connection.asPromise();
  } catch (error) {
    // Only connect if no connection exists
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchats');
  }
  
  // Clear existing articles
  await Article.deleteMany({});
  console.log('🗑️ Cleared existing articles');

  const urls = [
    'https://beyondchats.com/blogs-2/page/15/',
    'https://beyondchats.com/blogs-2/page/14/'
  ];

  const articles = [];

  for (const url of urls) {
    console.log(`🔍 Scraping: ${url}`);
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      
      $('.blog-item, .post-item, article, .blog-post, .et_pb_post').each((i, el) => {
        const titleEl = $(el).find('h2 a, h3 a, .blog-title a, .title a, h1 a, h4 a').first();
        const excerptEl = $(el).find('.blog-excerpt, .post-excerpt, .summary, p, .entry-content').first();
        const linkEl = $(el).find('a[href*="/blogs"]').first();
        
        const title = titleEl.text().trim();
        const excerpt = excerptEl.text().trim();
        const link = linkEl.attr('href');
        
        if (title && excerpt && link && articles.length < 5) {
          articles.push({
            title: title.replace(/\s+/g, ' ').trim(),
            excerpt: excerpt.replace(/\s+/g, ' ').trim().slice(0, 200) + '...',
            content: excerpt.replace(/\s+/g, ' ').trim().slice(0, 500), // ✅ REQUIRED FIELD
            url: link.startsWith('http') ? link : `https://beyondchats.com${link}`
          });
          console.log(`✅ Found: ${title.slice(0, 50)}...`);
        }
      });
    } catch (error) {
      console.error(`❌ Error scraping ${url}:`, error.message);
    }
  }

  // Save ONLY 5 OLDEST articles
  for (let article of articles.slice(0, 5)) {
    await Article.create({
      ...article,
      original: true,
      is_updated: false, // ✅ For frontend filter
      date: new Date().toISOString().split('T')[0],
      author: 'BeyondChats Team'
    });
  }

  console.log(`🎉 Scraped & Saved ${articles.length} OLDEST articles from page 14-15!`);
  process.exit(0);
}

scrapeBeyondChats().catch(console.error);

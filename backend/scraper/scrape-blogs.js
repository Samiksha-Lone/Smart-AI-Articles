const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

async function scrapeOldestArticles() {
  console.log('🌐 Scraping OLDEST articles from pages 14-15...');
  
  const pagesToScrape = [15, 14];  // Very old pages
  const articles = [];
  
  for (let pageNum of pagesToScrape) {
    try {
      const url = `https://beyondchats.com/blogs/page/${pageNum}/`;
      console.log(`📄 Scraping ${url}`);
      
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      let foundArticle = false;
      
      $('.post, .blog-post, article, .hentry, .post-item').each((i, el) => {
        if (articles.length >= 5) return false;
        
        const titleEl = $(el).find('h2, h3, .post-title, a.entry-title').first();
        const linkEl = $(el).find('a[href*="/blogs/"]').first();
        
        if (titleEl.length && linkEl.length) {
          const title = titleEl.text().trim();
          const url = linkEl.attr('href');
          
          if (title && url && url.includes('beyondchats.com/blogs/')) {
            articles.push({ title, url });
            console.log(`✅ Found: ${title}`);
            foundArticle = true;
          }
        }
      });
      
      if (!foundArticle) console.log(`⚠️ No articles found on page ${pageNum}`);
      
    } catch (e) {
      console.log(`❌ Page ${pageNum} failed:`, e.message);
    }
  }
  
  // Limit to 5 articles
  const top5 = articles.slice(0, 5);
  console.log(`📖 Processing ${top5.length} articles...`);
  
  // Save with longer timeout
  for (let i = 0; i < top5.length; i++) {
    try {
      console.log(`Processing ${i + 1}/${top5.length}: ${top5[i].title}`);
      
      const fullPage = await axios.get(top5[i].url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 20000
      });
      
      const $$ = cheerio.load(fullPage.data);
      top5[i].content = $$('.entry-content, .post-content, .article-content').text().trim().slice(0, 5000);
      top5[i].excerpt = top5[i].content.slice(0, 200) + '...';
      top5[i].image = $$('img').first().attr('src') || '';
      
      // Save with retry
      const article = new Article(top5[i]);
      await article.save({ w: 1, wtimeout: 10000 });
      console.log(`✅ Saved: ${top5[i].title}`);
      
    } catch (e) {
      console.error(`❌ Save failed ${top5[i]?.title}:`, e.message);
    }
  }
  
  console.log('🎉 Phase 1 COMPLETE!');
}

module.exports = scrapeOldestArticles;
if (require.main === module) scrapeOldestArticles();

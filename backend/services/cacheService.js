// Simple in-memory cache for student project
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const cacheService = {
  // Generate cache key from content, title, and personalization options
  generateKey: (content, title, options = {}) => {
    // Include personalization options in cache key
    const { writingStyle = 'formal', tone = 'professional', template = 'custom' } = options;
    const combined = content + title + writingStyle + tone + template;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `article_${Math.abs(hash)}`;
  },

  // Get cached result
  get: (key) => {
    const cached = cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      cache.delete(key);
      return null;
    }

    console.log(`[Cache] Hit for key: ${key}`);
    return cached.data;
  },

  // Set cache result
  set: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`[Cache] Stored result for key: ${key}`);
  },

  // Clear expired entries (simple cleanup)
  cleanup: () => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        cache.delete(key);
      }
    }
  }
};

// Run cleanup every 10 minutes
setInterval(() => {
  cacheService.cleanup();
}, 10 * 60 * 1000);

module.exports = cacheService;
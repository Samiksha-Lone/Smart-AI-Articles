const userRequests = new Map();

const rateLimiter = (maxRequests = 5, windowMs = 60000) => {
  return (req, res, next) => {
    const userId = req.userId;
    if (!userId) return next();

    const now = Date.now();
    const userKey = `user_${userId}`;

    if (!userRequests.has(userKey)) {
      userRequests.set(userKey, []);
    }

    const requests = userRequests.get(userKey);

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    userRequests.set(userKey, validRequests);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'You are generating articles too fast. Please wait a moment before trying again.',
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    validRequests.push(now);
    next();
  };
};

module.exports = rateLimiter;
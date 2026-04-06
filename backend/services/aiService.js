const axios = require('axios');
const { OpenAI } = require('openai');
const cacheService = require('./cacheService');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

const buildPrompt = (originalContent, title, options = {}) => {
  const { writingStyle = 'formal', tone = 'professional', template = 'custom' } = options;

  // Phase 5: Template-specific instructions
  const templateInstructions = {
    blog: 'Format as a blog post with engaging introduction, clear sections, and compelling conclusion.',
    linkedin: 'Format as a LinkedIn post with professional tone, hashtags, and call-to-action.',
    email: 'Format as an email newsletter with subject line, greeting, and professional closing.',
    custom: 'Format as a general article with proper structure and flow.'
  };

  // Phase 5: Writing style instructions
  const styleInstructions = {
    formal: 'Use formal, professional language with complete sentences and proper grammar.',
    casual: 'Use conversational, friendly language with contractions and natural flow.'
  };

  // Phase 5: Tone instructions
  const toneInstructions = {
    professional: 'Maintain a professional, authoritative tone throughout.',
    friendly: 'Use a warm, approachable tone that engages the reader.',
    enthusiastic: 'Add energy and excitement to make the content more dynamic.'
  };

  return `You are a professional content editor and SEO specialist.
Enhance the following article content:

**Original Title:** ${title}
**Original Content:**
"${originalContent}"

**Content Requirements:**
- Template: ${templateInstructions[template]}
- Writing Style: ${styleInstructions[writingStyle]}
- Tone: ${toneInstructions[tone]}

**Instructions:**
1. Improve the writing style to be more professional, engaging, and clear.
2. Fix any grammar or spelling errors.
3. Organize the content with proper markdown headings, bullet points, and paragraphs.
4. Extrapolate on the key points to add depth, but keep the core message intact.
5. Analyze the sentiment, tone, and readability.
6. Extract 5-10 relevant SEO keywords.

**Output Format:**
Return ONLY a valid JSON object with this exact structure:
{
  "enhancedContent": "The full enhanced article in markdown format...",
  "analytics": {
    "sentiment": "Positive/Neutral/Negative",
    "tone": "Professional/Casual/Enthusiastic/Informative",
    "readabilityScore": 0-100,
    "keywords": ["keyword1", "keyword2", ...]
  }
}

Do NOT include markdown formatting around the JSON. Return ONLY the JSON.`;
};

const parseResponseText = (text) => {
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  if (cleaned.startsWith('`')) {
    cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '');
  }
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  return cleaned;
};

const callOpenAI = async (prompt) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Set it in your environment variables.');
  }

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1200,
    temperature: 0.7,
  });

  const textResponse = response.choices[0]?.message?.content;
  if (!textResponse) {
    throw new Error('No response received from OpenAI');
  }

  return textResponse;
};

const callOllama = async (prompt) => {
  await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });

  const response = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      temperature: 0.7,
    },
    { timeout: 120000 }
  );

  const textResponse = response.data?.response;
  if (!textResponse) {
    throw new Error('No response received from Ollama');
  }

  return textResponse;
};

// Phase 3 AI Intelligence Functions
const computeAIScores = (content, title) => {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // Readability Score (based on sentence length and complexity)
  let readability = 100;
  if (avgSentenceLength > 25) readability -= 30;
  else if (avgSentenceLength > 20) readability -= 15;
  else if (avgSentenceLength < 10) readability -= 10;
  if (wordCount < 300) readability -= 20;
  readability = Math.max(0, Math.min(100, readability));

  // Engagement Score (based on structure and variety)
  let engagement = 50;
  engagement += Math.min(20, headings * 5); // headings
  engagement += Math.min(15, paragraphs.length * 2); // paragraphs
  engagement += Math.min(15, Math.floor(wordCount / 100)); // length bonus
  engagement = Math.max(0, Math.min(100, engagement));

  // SEO Score (basic keyword presence and structure)
  let seo = 30; // base score
  const hasTitle = title && title.length > 10;
  const hasMetaElements = content.includes('**') || content.includes('*');
  const hasLinks = content.includes('http') || content.includes('www');
  if (hasTitle) seo += 20;
  if (hasMetaElements) seo += 25;
  if (hasLinks) seo += 25;
  seo = Math.max(0, Math.min(100, seo));

  return {
    readability: Math.round(readability),
    engagement: Math.round(engagement),
    seo: Math.round(seo),
    wordCount,
    sentenceCount,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10
  };
};

const generateSuggestions = (content, title) => {
  const suggestions = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);

  // Check for long sentences
  sentences.forEach((sentence, index) => {
    const wordCount = sentence.trim().split(/\s+/).length;
    if (wordCount > 30) {
      suggestions.push({
        type: 'sentence',
        message: `Long sentence (${wordCount} words). Consider breaking it into shorter sentences.`,
        position: content.indexOf(sentence),
        severity: 'medium'
      });
    }
  });

  // Check for short content
  if (words.length < 200) {
    suggestions.push({
      type: 'structure',
      message: 'Article is quite short. Consider adding more depth and examples.',
      position: 0,
      severity: 'high'
    });
  }

  // Check for missing headings
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  if (headings === 0) {
    suggestions.push({
      type: 'structure',
      message: 'Consider adding headings to improve readability and structure.',
      position: 0,
      severity: 'medium'
    });
  }

  // Check for repetitive words (simple check)
  const wordFreq = {};
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length > 3) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });

  Object.entries(wordFreq).forEach(([word, count]) => {
    if (count > Math.max(5, words.length / 50)) { // More than 5 times or 2% of total words
      suggestions.push({
        type: 'word',
        message: `Word "${word}" is used ${count} times. Consider using synonyms for variety.`,
        position: content.toLowerCase().indexOf(word),
        severity: 'low'
      });
    }
  });

  return suggestions.slice(0, 10); // Limit to 10 suggestions
};

const analyzeKeywords = (content, title) => {
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordFreq = {};

  // Count word frequencies
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });

  // Get top keywords
  const topKeywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Basic missing keywords (could be expanded with AI)
  const commonKeywords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const missingKeywords = commonKeywords.filter(kw => !wordFreq[kw]);

  const totalWords = words.length;
  const keywordWords = topKeywords.reduce((sum, k) => sum + k.count, 0);
  const keywordDensity = totalWords > 0 ? (keywordWords / totalWords) * 100 : 0;

  return {
    topKeywords,
    missingKeywords: missingKeywords.slice(0, 5),
    keywordDensity: Math.round(keywordDensity * 100) / 100
  };
};

async function enhanceContent(originalContent, title, options = {}) {
  try {
    if (!originalContent || !title) {
      throw new Error('Original content and title are required');
    }

    // Phase 4: Check cache first (include options in cache key)
    const cacheKey = cacheService.generateKey(originalContent, title, options);
    const cachedResult = cacheService.get(cacheKey);
    if (cachedResult) {
      console.log('[AI Service] Returning cached result');
      return cachedResult;
    }

    const prompt = buildPrompt(originalContent, title, options);
    let textResponse;

    if (OPENAI_API_KEY) {
      console.log(`[AI Service] Calling OpenAI model ${OPENAI_MODEL}`);
      textResponse = await callOpenAI(prompt);
    } else {
      console.log(`[AI Service] Calling Ollama at ${OLLAMA_BASE_URL} using model: ${OLLAMA_MODEL}`);
      textResponse = await callOllama(prompt);
    }

    console.log(`[AI Service] Raw response length: ${textResponse.length}`);

    const cleanedResponse = parseResponseText(textResponse);
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`[AI Service] JSON parsing failed. Response: ${cleanedResponse.substring(0, 300)}...`);
      throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
    }

    if (!parsedResponse.enhancedContent || !parsedResponse.analytics) {
      throw new Error('AI response missing required fields (enhancedContent or analytics)');
    }

    if (typeof parsedResponse.analytics.readabilityScore !== 'number') {
      parsedResponse.analytics.readabilityScore = parseInt(parsedResponse.analytics.readabilityScore, 10) || 50;
    }

    // Phase 3: Add AI Intelligence metrics
    const aiScores = computeAIScores(originalContent, title);
    const suggestions = generateSuggestions(originalContent, title);
    const keywordAnalysis = analyzeKeywords(originalContent, title);

    parsedResponse.analytics.aiScores = aiScores;
    parsedResponse.analytics.suggestions = suggestions;
    parsedResponse.analytics.keywordAnalysis = keywordAnalysis;

    // Phase 4: Cache the result
    cacheService.set(cacheKey, parsedResponse);

    console.log('[AI Service] Successfully enhanced content with AI intelligence');
    return parsedResponse;
  } catch (error) {
    console.error('[AI Service] Error during enhancement:', error.message);
    throw error;
  }
}

module.exports = { enhanceContent };

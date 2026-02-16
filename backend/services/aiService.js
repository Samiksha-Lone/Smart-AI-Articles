const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function enhanceContent(originalContent, title) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }

    if (!originalContent || !title) {
      throw new Error("Original content and title are required");
    }

    const prompt = `
      Act as a professional content editor and SEO specialist. 
      Your task is to ENHANCE the following article content.
      
      **Original Title:** ${title}
      **Original Content:**
      "${originalContent}"

      **Instructions:**
      1. Improve the writing style to be more professional, engaging, and clear.
      2. Fix any grammar or spelling errors.
      3. Organize the content with proper markdown headings, bullet points, and paragraphs.
      4. Extrapolate on the key points to add depth, but keep the core message intact.
      5. Analyze the sentiment, tone, and readability.
      6. Extract 5-10 relevant SEO keywords.

      **Output Format:**
      You must output a VALID JSON object with the following structure:
      {
        "enhancedContent": "The full enhanced article in markdown format...",
        "analytics": {
          "sentiment": "Positive/Neutral/Negative",
          "tone": "Professional/Casual/Enthusiastic/Informative",
          "readabilityScore": 0-100 (integer),
          "keywords": ["keyword1", "keyword2", ...]
        }
      }

      Return ONLY the JSON. Do not include any markdown formatting around the JSON (like \`\`\`json).
    `;

    let textResponse = "";
    let lastError = null;

    const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-2.0-flash-001"];
    
    for (const modelName of modelsToTry) {
        try {
            console.log(`[AI Service] Attempting to use model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            textResponse = response.text();
            console.log(`[AI Service] Successfully used model: ${modelName}`);
            break;
        } catch (error) {
            lastError = error;
            console.log(`[AI Service] Model ${modelName} failed: ${error.message}`);
            if (modelName === modelsToTry[modelsToTry.length - 1]) {
                 throw new Error(`All AI models failed. Last error: ${error.message}`);
            }
        }
    }

    if (!textResponse) {
      throw new Error("No response received from AI service");
    }

    console.log(`[AI Service] Raw response received (${textResponse.length} characters)`);

    // Clean up response
    let cleanedResponse = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Handle potential markdown code blocks
    if (cleanedResponse.startsWith("`")) {
      cleanedResponse = cleanedResponse.replace(/^`+/, "").replace(/`+$/, "");
    }

    console.log(`[AI Service] Cleaned response (${cleanedResponse.length} characters)`);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`[AI Service] JSON parsing failed. Response: ${cleanedResponse.substring(0, 200)}...`);
      throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
    }

    // Validate response structure
    if (!parsedResponse.enhancedContent || !parsedResponse.analytics) {
      throw new Error("AI response missing required fields (enhancedContent or analytics)");
    }

    console.log(`[AI Service] Successfully enhanced content`);
    return parsedResponse;

  } catch (error) {
    console.error(`[AI Service] Error during enhancement: ${error.message}`);
    throw error;
  }
}

module.exports = { enhanceContent };


export const AI_CONFIG = {
  /**
   * AI Provider Selection
   * Reverted back to Gemini exclusively.
   */
  model: 'gemini-3-flash-preview',
  
  /**
   * Token and response limits
   */
  maxOutputTokens: 500,
  temperature: 0.7,
  
  /**
   * API Key obtained from environment
   */
  apiKey: process.env.API_KEY
};


import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AI_CONFIG } from "./aiConfig";
import { GLOBAL_BEHAVIOR, MODE_PROMPTS } from "../constants";
import { AppMode, Translation } from "../types";

/**
 * Sends a message stream to Google Gemini.
 * Uses direct generateContentStream to satisfy "do not define model first" guidelines.
 */
export const sendMessageStream = async (
  mode: AppMode,
  translation: Translation,
  kidsMode: boolean,
  history: { role: 'user' | 'assistant', content: string }[],
  onChunk: (text: string) => void
) => {
  const systemInstruction = GLOBAL_BEHAVIOR(translation) + "\n" + MODE_PROMPTS[mode] + 
    (kidsMode ? "\nIMPORTANT: User is a child. Use very simple words. Short answers. Gentle tone. Hide adult topics." : "");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const result = await ai.models.generateContentStream({
      model: AI_CONFIG.model,
      contents: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
        temperature: AI_CONFIG.temperature
      }
    });

    let fullText = "";
    for await (const chunk of result) {
      const responseChunk = chunk as GenerateContentResponse;
      const text = responseChunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Exact requested error string
    throw new Error("AI unavailable. Please continue with Bible study.");
  }
};

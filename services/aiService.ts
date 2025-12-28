
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AI_CONFIG } from "./aiConfig";
import { GLOBAL_BEHAVIOR, MODE_PROMPTS } from "../constants";
import { AppMode, Translation } from "../types";

const DAILY_LIMIT = 3;

const checkRateLimit = (): boolean => {
  const today = new Date().toDateString();
  const usageStr = localStorage.getItem('hbgpt_ai_usage');
  let usage = usageStr ? JSON.parse(usageStr) : { date: today, count: 0 };

  if (usage.date !== today) {
    usage = { date: today, count: 0 };
  }

  if (usage.count >= DAILY_LIMIT) return false;

  usage.count++;
  localStorage.setItem('hbgpt_ai_usage', JSON.stringify(usage));
  return true;
};

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

  if (!checkRateLimit()) {
    throw new Error("You reached today’s AI limit. Please keep reading. New questions reset tomorrow.");
  }

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

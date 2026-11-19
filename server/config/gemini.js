import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const primaryKey = process.env.GEMINI_API_KEY;
const backupKey = process.env.GEMINI_API_KEY_BACKUP;

const keys = [primaryKey, backupKey].filter(Boolean);
const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

const withTimeout = (promise, ms = 18000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Model call timed out after ${ms}ms`)), ms))
  ]);
};

export const generateWithFallback = async (prompt) => {
  if (keys.length === 0) {
    throw new Error('No GEMINI_API_KEY configured');
  }

  let lastError = null;

  for (const key of keys) {
    const ai = new GoogleGenerativeAI(key);
    for (const m of models) {
      try {
        const model = ai.getGenerativeModel({ model: m });
        const res = await withTimeout(model.generateContent(prompt), 18000);
        const text = res.response.text();
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Model ${m} Key ${key.slice(0, 8)}] error:`, err.message);
      }
    }
  }

  throw lastError || new Error('All Gemini models and keys exhausted');
};

export const getGeminiModel = (modelName = 'gemini-3.5-flash-lite') => {
  const ai = new GoogleGenerativeAI(primaryKey || backupKey);
  return ai.getGenerativeModel({ model: modelName });
};

export default { generateWithFallback, getGeminiModel };

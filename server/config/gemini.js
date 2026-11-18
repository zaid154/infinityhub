import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS;

if (!apiKey) {
  console.warn('[Gemini AI Warning] No GEMINI_API_KEY found in environment.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelName = 'gemini-2.0-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;

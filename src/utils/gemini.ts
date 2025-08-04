import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. AI features will be limited.');
    return null;
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

export async function callGemini(prompt: string, model: string = 'gemini-1.5-flash'): Promise<string> {
  if (!genAI) {
    genAI = initializeGemini();
  }
  
  if (!genAI) {
    throw new Error('Gemini AI not initialized. Please set GEMINI_API_KEY environment variable.');
  }

  try {
    const generativeModel = genAI.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

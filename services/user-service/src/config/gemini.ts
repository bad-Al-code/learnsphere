import { GoogleGenAI } from '@google/genai';

import { env } from './env';
import logger from './logger';

class GeminiClient {
  private static instance: GoogleGenAI;

  /**
   * Gets a singletong instance off the GoogeGenAI clien.
   * @returns { GoogleGenAI} The initialized client instance
   */
  public static getInstance(): GoogleGenAI {
    if (!GeminiClient.instance) {
      try {
        GeminiClient.instance = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

        logger.info('GoogleGenAI client initialzed successfully.');
      } catch (error) {
        logger.error('Failed to initialize GoogleGenerativeAI client', {
          error,
        });

        throw new Error('Could not initialize Gemini AI client.');
      }
    }

    return GeminiClient.instance;
  }
}

export const gemini = GeminiClient.getInstance();

import { GoogleGenAI } from '@google/genai';

import { env } from '../../../config/env';
import logger from '../../../config/logger';

export class GeminiClient {
  private static instance: GoogleGenAI;

  public static getInstance(): GoogleGenAI {
    if (!this.instance) {
      try {
        this.instance = new GoogleGenAI({
          apiKey: env.GEMINI_API_KEY,
        });

        logger.info('GoogleGenAI client initialized successfully.');
      } catch (error) {
        logger.error('Failed to initialize GoogleGenAI client', { error });

        throw new Error('Could not initialize GoogleGenAI client.');
      }
    }

    return this.instance;
  }
}

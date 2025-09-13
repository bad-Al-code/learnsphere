import { GoogleGenAI } from '@google/genai';
import { env } from '../../../config/env';
import logger from '../../../config/logger';

class GoogleProvider {
  private static instance: GoogleGenAI;

  /**
   * Returns a singleton instance of the GoogleGenAI client.
   * @returns {GoogleGenAI} GoogleGenAI client instance.
   */
  public static getInstance(): GoogleGenAI {
    if (!GoogleProvider.instance) {
      try {
        GoogleProvider.instance = new GoogleGenAI({
          apiKey: env.GEMINI_API_KEY,
        });

        logger.info('GoogleGenAI client initialized successfully.');
      } catch (error) {
        logger.error('Failed to initialize GoogleGenAI client', { error });

        throw new Error('Could not initialize GoogleGenAI client.');
      }
    }

    return GoogleProvider.instance;
  }
}

export const googleProvider = GoogleProvider.getInstance();

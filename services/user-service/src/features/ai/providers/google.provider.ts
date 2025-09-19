import type { Session } from '@google/genai';
import { GoogleGenAI, LiveConnectParameters } from '@google/genai';
import { env } from '../../../config/env';
import logger from '../../../config/logger';

export class GoogleProvider {
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

  /**
   * Creates and connects a new LiveSession.
   * @param {StartLiveSessionParameters} params - The parameters for starting the session.
   * @returns {Promise<Session>} A promise that resolves with the connected session object.
   */
  public static async connectLiveSession(
    params: Omit<LiveConnectParameters, 'apiKey'>
  ): Promise<Session> {
    const client = this.getInstance();
    return client.live.connect(params);
  }
}

export const googleProvider = GoogleProvider.getInstance();

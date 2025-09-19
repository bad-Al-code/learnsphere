import {
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
import { WebSocket } from 'ws';

import logger from '../../../config/logger';
import { AITutorConversation } from '../../../db/schema';
import { ForbiddenError, NotFoundError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { buildTutorInstruction } from '../prompts/tutorInstruction.prompt';
import { GoogleProvider } from '../providers/google.provider';

export class VoiceTutorSession {
  private geminiSession: Session;
  private conversationRecord: AITutorConversation;
  private clientWs: WebSocket;
  private static model = 'models/gemini-2.5-flash-preview-native-audio-dialog';

  private constructor(
    geminiSession: Session,
    conversationRecord: AITutorConversation,
    clientWs: WebSocket
  ) {
    this.geminiSession = geminiSession;
    this.conversationRecord = conversationRecord;
    this.clientWs = clientWs;
  }

  /**
   * Creates and initializes a new VoiceTutorSession.
   * This static factory method handles user validation, fetching course content,
   * creating a database record, and establishing the live connection to the AI model.
   * @public
   * @static
   * @param {string} userId - The ID of the user initiating the session.
   * @param {string} courseId - The ID of the course context for the session.
   * @param {WebSocket} clientWs - The WebSocket connection to the client.
   * @returns {Promise<VoiceTutorSession>} A promise that resolves to a new VoiceTutorSession instance.
   * @throws {ForbiddenError} If the user is not enrolled in the specified course.
   * @throws {NotFoundError} If the content for the specified course cannot be found.
   */
  public static async create(
    userId: string,
    courseId: string,
    clientWs: WebSocket
  ): Promise<VoiceTutorSession> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError(
        'You must be enrolled in this course to create notes.'
      );
    }

    const courseContent = await AIRepository.getCourseContent(courseId);
    if (!courseContent?.content) {
      throw new NotFoundError('Course content for voice session.');
    }

    const systemInstruction = buildTutorInstruction(courseContent.content);

    const conversationRecord = await AIRepository.createConversation(
      userId,
      courseId,
      `Voice Session - ${new Date().toLocaleString()}`
    );

    const geminiSession = await GoogleProvider.connectLiveSession({
      model: this.model,
      config: {
        systemInstruction,
        responseModalities: [Modality.AUDIO],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },

      callbacks: {
        onopen: () => {
          logger.info(
            `Gemini Live session opened for conversation ${conversationRecord.id}`
          );
        },

        onmessage: (message: LiveServerMessage) => {
          this.handleModelMessage(message, clientWs, conversationRecord).catch(
            (err) => {
              logger.error('Error handling model message', { err });
            }
          );
        },

        onerror: (e: ErrorEvent) => {
          logger.error(
            `Gemini Live error for conversation ${conversationRecord.id}`,
            e.message
          );

          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(1011, 'AI session error');
          }
        },

        onclose: (e: CloseEvent) => {
          logger.info(
            `Gemini Live session closed for conversation ${conversationRecord.id}, reason: ${e.reason}`
          );
        },
      },
    });

    return new VoiceTutorSession(geminiSession, conversationRecord, clientWs);
  }

  /**
   * Processes messages received from the Gemini model.
   * It extracts audio data to be sent to the client and text data to be saved in the database.
   * @private
   * @static
   * @param {LiveServerMessage} message - The message object from the Gemini session.
   * @param {WebSocket} clientWs - The WebSocket connection to the client.
   * @param {AITutorConversation} conversationRecord - The database record for the conversation.
   * @returns {Promise<void>}
   */
  private static async handleModelMessage(
    message: LiveServerMessage,
    clientWs: WebSocket,
    conversationRecord: AITutorConversation
  ) {
    const parts = message.serverContent?.modelTurn?.parts ?? [];

    for (const part of parts) {
      if (part.inlineData?.data) {
        const audioBuffer = Buffer.from(part.inlineData.data, 'base64');

        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(audioBuffer);
        }
      }

      if (part.text) {
        await AIRepository.addMessage({
          conversationId: conversationRecord.id,
          role: 'model',
          content: part.text,
        });
      }
    }
  }

  /**
   * Handles an incoming audio chunk from the client and forwards it to the Gemini session.
   * @public
   * @param {Buffer} chunk - A buffer containing the raw audio data (PCM).
   * @returns {Promise<void>}
   */
  public async handleAudioChunk(chunk: Buffer): Promise<void> {
    await this.geminiSession.sendClientContent({
      turns: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'audio/pcm;rate=16000',
                data: chunk.toString('base64'),
              },
            },
          ],
        },
      ],
    });
  }

  /**
   * Handles a final user transcript, saves it to the database, and sends it to Gemini.
   * This is typically used when the user finishes speaking.
   * @public
   * @param {string} text - The final transcript of the user's speech.
   * @returns {Promise<void>}
   */
  public async handleUserTranscript(text: string): Promise<void> {
    await AIRepository.addMessage({
      conversationId: this.conversationRecord.id,
      role: 'user',
      content: text,
    });

    await this.geminiSession.sendClientContent({
      turns: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
    });
  }

  /**
   * Gracefully closes the connection to the Gemini session.
   * @public
   */
  public close(): void {
    this.geminiSession.close();
  }
}

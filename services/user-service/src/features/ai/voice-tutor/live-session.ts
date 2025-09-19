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
  private isProcessing = false;
  private audioQueue: Buffer[] = [];
  private isPlaying = false;

  private constructor(
    geminiSession: Session,
    conversationRecord: AITutorConversation,
    clientWs: WebSocket
  ) {
    this.geminiSession = geminiSession;
    this.conversationRecord = conversationRecord;
    this.clientWs = clientWs;
  }

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

    // eslint-disable-next-line prefer-const
    let sessionInstance: VoiceTutorSession;

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

          if (clientWs.readyState === WebSocket.OPEN) {
            const greeting = JSON.stringify({
              type: 'transcript',
              role: 'assistant',
              text: "Hello! I'm your AI voice tutor. How can I help you with your learning today?",
              timestamp: new Date().toISOString(),
            });
            clientWs.send(greeting);
          }
        },

        onmessage: (message: LiveServerMessage) => {
          if (sessionInstance) {
            sessionInstance.handleModelMessage(message).catch((err) => {
              logger.error('Error handling model message', { err });
            });
          }
        },

        onerror: (e: ErrorEvent) => {
          logger.error(
            `Gemini Live error for conversation ${conversationRecord.id}`,
            e.message
          );

          if (clientWs.readyState === WebSocket.OPEN) {
            const errorMsg = JSON.stringify({
              type: 'error',
              message: 'AI session encountered an error',
              timestamp: new Date().toISOString(),
            });
            clientWs.send(errorMsg);
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

    sessionInstance = new VoiceTutorSession(
      geminiSession,
      conversationRecord,
      clientWs
    );
    return sessionInstance;
  }

  private async handleModelMessage(message: LiveServerMessage): Promise<void> {
    try {
      const parts = message.serverContent?.modelTurn?.parts ?? [];

      for (const part of parts) {
        if (
          part.inlineData?.data &&
          part.inlineData?.mimeType?.includes('audio')
        ) {
          const audioBuffer = Buffer.from(part.inlineData.data, 'base64');

          if (this.clientWs.readyState === WebSocket.OPEN) {
            this.audioQueue.push(audioBuffer);
            this.processAudioQueue();
          }
        }

        if (part.text) {
          await AIRepository.addMessage({
            conversationId: this.conversationRecord.id,
            role: 'model',
            content: part.text,
          });

          if (this.clientWs.readyState === WebSocket.OPEN) {
            const transcriptData = JSON.stringify({
              type: 'transcript',
              role: 'assistant',
              text: part.text,
              timestamp: new Date().toISOString(),
            });
            this.clientWs.send(transcriptData);
          }
        }
      }
    } catch (error) {
      logger.error('Error handling model message', { error });
    }
  }

  private processAudioQueue(): void {
    if (this.audioQueue.length === 0 || this.isPlaying) return;

    const audioBuffer = this.audioQueue.shift();
    if (!audioBuffer) return;

    this.isPlaying = true;

    if (this.clientWs.readyState === WebSocket.OPEN) {
      this.clientWs.send(audioBuffer);
    }

    setTimeout(() => {
      this.isPlaying = false;
      this.processAudioQueue();
    }, 100);
  }

  public async handleAudioChunk(chunk: Buffer): Promise<void> {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;

      if (chunk.length === 0) {
        logger.warn('Received empty audio chunk');
        return;
      }

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
    } catch (error) {
      logger.error('Error sending audio chunk to Gemini', {
        error: error instanceof Error ? error.message : 'Unknown error',
        chunkSize: chunk.length,
      });

      if (this.clientWs.readyState === WebSocket.OPEN) {
        const errorMsg = JSON.stringify({
          type: 'error',
          message: 'Failed to process audio',
          timestamp: new Date().toISOString(),
        });
        this.clientWs.send(errorMsg);
      }
    } finally {
      setTimeout(() => {
        this.isProcessing = false;
      }, 50);
    }
  }

  public async handleUserTranscript(text: string): Promise<void> {
    try {
      if (!text.trim()) {
        logger.warn('Received empty transcript text');
        return;
      }

      await AIRepository.addMessage({
        conversationId: this.conversationRecord.id,
        role: 'user',
        content: text.trim(),
      });

      await this.geminiSession.sendClientContent({
        turns: [
          {
            role: 'user',
            parts: [{ text: text.trim() }],
          },
        ],
      });

      if (this.clientWs.readyState === WebSocket.OPEN) {
        const transcriptData = JSON.stringify({
          type: 'transcript',
          role: 'user',
          text: text.trim(),
          timestamp: new Date().toISOString(),
        });
        this.clientWs.send(transcriptData);
      }
    } catch (error) {
      logger.error('Error handling user transcript', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length,
      });

      if (this.clientWs.readyState === WebSocket.OPEN) {
        const errorMsg = JSON.stringify({
          type: 'error',
          message: 'Failed to process text message',
          timestamp: new Date().toISOString(),
        });
        this.clientWs.send(errorMsg);
      }
    }
  }

  public close(): void {
    try {
      this.isProcessing = false;
      this.audioQueue = [];
      this.isPlaying = false;

      if (this.geminiSession) {
        this.geminiSession.close();
      }
    } catch (error) {
      logger.error('Error closing Gemini session', { error });
    }
  }
}

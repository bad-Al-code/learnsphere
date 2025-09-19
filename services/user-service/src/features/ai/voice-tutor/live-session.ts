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

    const responseQueue: LiveServerMessage[] = [];

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
          responseQueue.push(message);
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

  public close(): void {
    this.geminiSession.close();
  }
}

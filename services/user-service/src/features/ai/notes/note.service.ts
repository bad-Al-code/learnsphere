import { GenerateContentResponse } from '@google/genai';
import { UserNote } from '../../../db/schema';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../../errors';
import { AIRepository } from '../ai.repository';
import { buildNoteAnalysisInstruction } from '../prompts/noteAnalysis.prompt';
import { Providers } from '../providers';
import { noteAnalysisResponseSchema } from '../schema/noteInsights.schema';
import { NoteRepository } from './note.repository';
import { noteAnalysisZodSchema } from './note.schema';

export class NoteService {
  private static provider = Providers.google;
  private static model: string = 'gemini-2.5-flash-lite';

  /**
   * Creates a new note for a user, ensuring they are enrolled in the course.
   * @param userId The ID of the user creating the note.
   * @param courseId The ID of the course the note is for.
   * @param title The title of the note.
   * @param content Optional initial content for the note.
   * @returns The newly created note.
   */
  public static async createNote(
    userId: string,
    courseId: string,
    title: string,
    content?: string
  ): Promise<UserNote> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError(
        'You must be enrolled in this course to create notes.'
      );
    }

    return NoteRepository.createNote({
      userId,
      courseId,
      title,
      content: content || '',
    });
  }

  /**
   * Retrieves all notes for a user within a specific course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A list of the user's notes for that course.
   */
  public static async getNotesForCourse(
    userId: string,
    courseId: string
  ): Promise<UserNote[]> {
    return NoteRepository.findNotesByUserAndCourse(userId, courseId);
  }

  /**
   * Updates an existing note if it belongs to the given user.
   * @param noteId - The ID of the note to update.
   * @param userId - The ID of the user who owns the note.
   * @param data - Partial update data containing a new title and/or content.
   * @returns The updated note object.
   * @throws {ForbiddenError} If the note does not exist or does not belong to the user.
   */
  public static async updateNote(
    noteId: string,
    userId: string,
    data: { title?: string; content?: string }
  ): Promise<UserNote> {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note || note.userId !== userId) {
      throw new ForbiddenError();
    }

    return NoteRepository.updateNote(noteId, data);
  }

  /**
   * Deletes an existing note if it belongs to the given user.
   * @param noteId - The ID of the note to delete.
   * @param userId - The ID of the user who owns the note.
   * @throws {ForbiddenError} If the note does not exist or does not belong to the user.
   */
  public static async deleteNote(
    noteId: string,
    userId: string
  ): Promise<void> {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note || note.userId !== userId) {
      throw new ForbiddenError();
    }

    await NoteRepository.deleteNote(noteId);
  }

  /**
   * Analyzes a note using AI-generated insights.
   * @param noteId - The ID of the note to analyze.
   * @param userId - The ID of the user who owns the note.
   * @returns The updated note object with AI-generated insights.
   */
  public static async analyzeNote(noteId: string, userId: string) {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note || note.userId !== userId) {
      throw new ForbiddenError();
    }

    if (!note.content) {
      throw new BadRequestError('Cannot analyze an empty note.');
    }

    const courseContent = await AIRepository.getCourseContent(note.courseId);
    if (!courseContent?.content) {
      throw new NotFoundError('Course content for this note is not available.');
    }

    const systemInstruction = buildNoteAnalysisInstruction(
      courseContent.content
    );
    const prompt = `Here are the user's notes to analyze:\n\n---\n${note.content}\n---`;

    const response: GenerateContentResponse =
      await this.provider.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: noteAnalysisResponseSchema,
        },
      });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = noteAnalysisZodSchema.parse(JSON.parse(text));

    return NoteRepository.updateNoteWithInsights(noteId, parsed);
  }
}

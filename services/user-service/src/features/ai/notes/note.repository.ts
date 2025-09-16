import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../../db';
import { NewUserNote, UserNote, userNotes } from '../../../db/schema';
import { NoteInsights } from './note.types';

export class NoteRepository {
  /**
   * Creates a new user note in the database.
   * @param data The data for the new note.
   * @returns The newly created note object.
   */
  public static async createNote(data: NewUserNote): Promise<UserNote> {
    const [newNote] = await db.insert(userNotes).values(data).returning();
    return newNote;
  }

  /**
   * Finds all notes for a specific user within a specific course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A list of notes, sorted by most recently updated.
   */
  public static async findNotesByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<UserNote[]> {
    return db.query.userNotes.findMany({
      where: and(
        eq(userNotes.userId, userId),
        eq(userNotes.courseId, courseId)
      ),
      orderBy: [desc(userNotes.updatedAt)],
    });
  }

  /**
   * Finds a single user note by its ID.
   * @param noteId The ID of the note.
   * @returns The note object or undefined if not found.
   */
  public static async findNoteById(
    noteId: string
  ): Promise<UserNote | undefined> {
    return db.query.userNotes.findFirst({
      where: eq(userNotes.id, noteId),
    });
  }

  /**
   * Updates a note's title or content.
   * @param noteId The ID of the note to update.
   * @param data The data to update (title and/or content).
   * @returns The updated note object.
   */
  public static async updateNote(
    noteId: string,
    data: { title?: string; content?: string }
  ) {
    const [updatedNote] = await db
      .update(userNotes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userNotes.id, noteId))
      .returning();

    return updatedNote;
  }

  /**
   * Updates a note with AI-generated insights.
   * @param noteId The ID of the note to update.
   * @param insights The JSON object containing the AI insights.
   * @returns The updated note object.
   */
  public static async updateNoteWithInsights(
    noteId: string,
    insights: NoteInsights
  ) {
    const [updatedNote] = await db
      .update(userNotes)
      .set({ insights, updatedAt: new Date() })
      .where(eq(userNotes.id, noteId))
      .returning();

    return updatedNote;
  }

  /**
   * Deletes a note from the database.
   * @param noteId The ID of the note to delete.
   */
  public static async deleteNote(noteId: string): Promise<void> {
    await db.delete(userNotes).where(eq(userNotes.id, noteId));
  }
}

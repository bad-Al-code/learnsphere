import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../../db';
import { NewUserNote, UserNote, userNotes } from '../../../db/schema';

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
}

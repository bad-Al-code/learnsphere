import { UserNote } from '../../../db/schema';
import { ForbiddenError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { NoteRepository } from './note.repository';

export class NoteService {
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
}

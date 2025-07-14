import { eq, inArray } from 'drizzle-orm';

import { db } from '../index';
import { lessons, textLessonContent } from '../schema';
import { NewLesson, Lesson, UpdateLessonDto } from '../../types';

export class LessonRepository {
  /**
   * Creates a new lesson.
   * @param data - The data for the new lesson.
   * @returns The newly created lesson object.
   */
  public static async create(data: NewLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(data).returning();
    return newLesson;
  }

  /**
   * Finds a single lesson by its ID, including its parent module and course for auth checks.
   * @param lessonId - The ID of the lesson to find.
   * @returns The lesson object with its parent relations, or undefined.
   */
  public static async findById(lessonId: string) {
    return db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { module: { with: { course: true } } },
    });
  }

  /**
   * Finds a single lesson and its specific content (e.g., text content).
   * @param lessonId - The ID of the lesson.
   * @returns The lesson object with its related content table.
   */
  public static async findByIdWithContent(lessonId: string) {
    return db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { textContent: true },
    });
  }

  /**
   * Finds multiple lessons by their IDs, including their parent relations.
   * @param lessonIds - An array of lesson IDs.
   * @returns An array of lesson objects with their parent relations.
   */
  public static async findManyByIdsWithModule(lessonIds: string[]) {
    if (lessonIds.length === 0) return [];
    return db.query.lessons.findMany({
      where: inArray(lessons.id, lessonIds),
      with: { module: { with: { course: true } } },
    });
  }

  /**
   * Updates a lesson's data.
   * @param lessonId - The ID of the lesson to update.
   * @param data - An object with the fields to update.
   * @returns The updated lesson object.
   */
  public static async update(
    lessonId: string,
    data: Partial<Omit<UpdateLessonDto, 'content'>>
  ): Promise<Lesson> {
    const [updatedLesson] = await db
      .update(lessons)
      .set(data)
      .where(eq(lessons.id, lessonId))
      .returning();
    return updatedLesson;
  }

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The ID of the lesson to delete.
   */
  public static async delete(lessonId: string): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, lessonId));
  }

  /**
   * Creates text content for a lesson.
   * @param lessonId - The ID of the parent lesson.
   * @param content - The text content.
   */
  public static async createTextContent(
    lessonId: string,
    content: string
  ): Promise<void> {
    await db.insert(textLessonContent).values({ lessonId, content });
  }

  /**
   * Updates or inserts text content for a lesson.
   * @param lessonId - The ID of the parent lesson.
   * @param content - The text content.
   */
  public static async upsertTextContent(
    lessonId: string,
    content: string
  ): Promise<void> {
    await db
      .insert(textLessonContent)
      .values({ lessonId, content })
      .onConflictDoUpdate({
        target: textLessonContent.lessonId,
        set: { content },
      });
  }
}

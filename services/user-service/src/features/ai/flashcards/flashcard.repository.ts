import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../../db';
import { aiFlashcardDecks, FlashcardDecks } from '../../../db/schema';

export class FlashcardRepository {
  /**
   * Creates a new flashcard deck.
   * @param userId The ID of the user creating the deck.
   * @param courseId The ID of the course the deck belongs to.
   * @param title The title of the deck.
   * @returns The newly created deck object.
   */
  public static async createDeck(
    userId: string,
    courseId: string,
    title: string
  ): Promise<FlashcardDecks> {
    const [newDeck] = await db
      .insert(aiFlashcardDecks)
      .values({ userId, courseId, title })
      .returning();

    return newDeck;
  }

  /**
   * Finds all decks for a specific user within a specific course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A list of decks, sorted by most recently updated.
   */
  public static async getDecksByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<FlashcardDecks[]> {
    return db.query.aiFlashcardDecks.findMany({
      where: and(
        eq(aiFlashcardDecks.userId, userId),
        eq(aiFlashcardDecks.courseId, courseId)
      ),
      orderBy: [desc(aiFlashcardDecks.updatedAt)],
      with: { cards: { columns: { id: true } } },
    });
  }
}

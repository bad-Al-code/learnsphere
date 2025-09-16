import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../../db';
import {
  aiFlashcardDecks,
  aiFlashcards,
  Flashcard,
  FlashcardDecks,
} from '../../../db/schema';
import { GeneratedCard } from './flashcard.types';

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

  /**
   * Finds a flashcard deck by its ID.
   * @param deckId - The unique identifier of the deck.
   * @returns The flashcard deck if found, otherwise `null`.
   */
  public static async findDeckById(
    deckId: string
  ): Promise<FlashcardDecks | undefined> {
    return db.query.aiFlashcardDecks.findFirst({
      where: eq(aiFlashcardDecks.id, deckId),
    });
  }

  /**
   * Deletes a flashcard deck by its ID. Also cascades deletion of its cards.
   * @param deckId - The unique identifier of the deck.
   * @returns Nothing (`void`) if the deletion succeeds.
   */
  public static async deleteDeck(deckId: string): Promise<void> {
    await db.delete(aiFlashcardDecks).where(eq(aiFlashcardDecks.id, deckId));
  }

  /**
   * Adds a set of flashcards to an existing deck.
   * Inserts all cards in a single transaction and returns the updated deck with cards.
   * @param deckId - The unique identifier of the deck.
   * @param cards - The flashcards to insert, each containing a `question` and `answer`.
   * @returns The updated deck with all its cards.
   */
  public static async addCardsToDeck(
    deckId: string,
    cards: GeneratedCard[]
  ): Promise<(FlashcardDecks & { cards: Flashcard[] }) | undefined> {
    return db.transaction(async (tx) => {
      const cardsToInsert = cards.map((card) => ({
        deckId,
        question: card.question,
        answer: card.answer,
      }));

      if (cardsToInsert.length > 0) {
        await tx.insert(aiFlashcards).values(cardsToInsert);
      }

      return tx.query.aiFlashcardDecks.findFirst({
        where: eq(aiFlashcardDecks.id, deckId),
        with: {
          cards: true,
        },
      });
    });
  }
}

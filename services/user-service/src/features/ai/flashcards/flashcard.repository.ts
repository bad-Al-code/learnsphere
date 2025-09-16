import { and, asc, desc, eq, sql } from 'drizzle-orm';

import { db } from '../../../db';
import {
  aiFlashcardDecks,
  aiFlashcards,
  Flashcard,
  FlashcardDecks,
  NewUserFlashcardProgress,
  userFlashcardProgress,
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

  /**
   * Fetches the cards for a study session for a specific user and deck.
   * Prioritizes cards that are due for review, then new cards.
   * @param userId The ID of the user.
   * @param deckId The ID of the deck.
   * @param limit The maximum number of cards to return for the session.
   * @returns An array of flashcard objects to be studied.
   */
  public static async getStudySession(
    userId: string,
    deckId: string,
    limit: number = 10
  ) {
    return db
      .select()
      .from(aiFlashcards)
      .leftJoin(
        userFlashcardProgress,
        and(
          eq(userFlashcardProgress.cardId, aiFlashcards.id),
          eq(userFlashcardProgress.userId, userId)
        )
      )
      .where(eq(aiFlashcards.deckId, deckId))
      .orderBy(
        sql`CASE WHEN ${userFlashcardProgress.nextReviewAt} <= NOW() THEN 0 ELSE 1 END`,
        asc(userFlashcardProgress.status),
        asc(aiFlashcards.id)
      )
      .limit(limit);
  }

  /**
   * Updates or inserts a user's progress for a specific flashcard.
   * @param data The progress data to save.
   */
  public static async updateCardProgress(data: NewUserFlashcardProgress) {
    await db
      .insert(userFlashcardProgress)
      .values(data)
      .onConflictDoUpdate({
        target: [userFlashcardProgress.userId, userFlashcardProgress.cardId],
        set: {
          status: data.status,
          nextReviewAt: data.nextReviewAt,
          lastReviewedAt: new Date(),
          correctStreaks: data.correctStreaks,
        },
      });
  }

  /**
   * Finds a flashcard in a specific deck.
   * @param deckId - The ID of the deck to search in.
   * @param cardId - The ID of the card to find.
   * @returns The flashcard if found, otherwise `undefined`.
   */
  public static async findCardInDeck(
    deckId: string,
    cardId: string
  ): Promise<Flashcard | undefined> {
    return db.query.aiFlashcards.findFirst({
      where: and(eq(aiFlashcards.id, cardId), eq(aiFlashcards.deckId, deckId)),
    });
  }

  /**
   * Retrieves a user's progress for a specific card.
   * @param userId - The ID of the user.
   * @param cardId - The ID of the flashcard.
   * @returns The user's flashcard progress, or `undefined` if no progress exists.
   */
  public static async getCardProgress(userId: string, cardId: string) {
    return db.query.userFlashcardProgress.findFirst({
      where: and(
        eq(userFlashcardProgress.userId, userId),
        eq(userFlashcardProgress.cardId, cardId)
      ),
    });
  }
}

import { FlashcardDecks } from '../../../db/schema';
import { ForbiddenError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { FlashcardRepository } from './flashcard.repository';

export class FlashcardService {
  /**
   * Creates a new flashcard deck, ensuring the user is enrolled in the course.
   * @param userId The user creating the deck.
   * @param courseId The course the deck is for.
   * @param title The title of the new deck.
   * @returns The newly created deck.
   */
  public static async createDeck(
    userId: string,
    courseId: string,
    title: string
  ): Promise<FlashcardDecks> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError(
        'You must be enrolled in this course to create a deck.'
      );
    }

    return FlashcardRepository.createDeck(userId, courseId, title);
  }

  /**
   * Retrieves all decks for a user within a specific course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A list of the user's flashcard decks.
   */
  public static async getDecks(
    userId: string,
    courseId: string
  ): Promise<FlashcardDecks[]> {
    return FlashcardRepository.getDecksByUserAndCourse(userId, courseId);
  }
}

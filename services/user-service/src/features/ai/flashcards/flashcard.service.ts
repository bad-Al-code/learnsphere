import { Flashcard, FlashcardDecks } from '../../../db/schema';
import { ForbiddenError, NotFoundError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { buildFlashcardInstruction } from '../prompts/flashcardInstruction.prompt';
import { Providers } from '../providers';
import { flashcardResponseSchema } from '../schema/flashcardResponse.schema';
import { FlashcardRepository } from './flashcard.repository';
import { flashcardResponseSchemaZod } from './flashcard.schema';

export class FlashcardService {
  private static provider = Providers.google;
  private static model: string = 'gemini-2.5-flash-lite';

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

  /**
   * Deletes a deck belonging to a specific user.
   * Verifies ownership before deletion.
   * @param deckId - The unique identifier of the deck.
   * @param userId - The ID of the user attempting to delete the deck.
   * @returns Nothing (`void`) if the deck is deleted successfully.
   */
  public static async deleteDeck(
    deckId: string,
    userId: string
  ): Promise<void> {
    const deck = await FlashcardRepository.findDeckById(deckId);
    if (!deck || deck.userId !== userId) {
      throw new ForbiddenError();
    }

    await FlashcardRepository.deleteDeck(deckId);
  }

  /**
   * Generates flashcards using the AI provider and adds them to a deck.
   * Ensures the user owns the deck and that course content is available before generation.
   *
   * @param deckId - The unique identifier of the deck to add flashcards to.
   * @param userId - The ID of the user who owns the deck.
   * @param topic - The topic for which flashcards should be generated.
   * @param difficulty - The difficulty level for the flashcards (`Beginner`, `Intermediate`, or `Advanced`).
   * @returns The updated deck including the newly generated flashcards.
   */
  public static async generateAndAddCards(
    deckId: string,
    userId: string,
    topic: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): Promise<(FlashcardDecks & { cards: Flashcard[] }) | undefined> {
    const deck = await FlashcardRepository.findDeckById(deckId);
    if (!deck || deck.userId !== userId) {
      throw new ForbiddenError();
    }

    const courseContent = await AIRepository.getCourseContent(deck.courseId);
    if (!courseContent?.content) {
      throw new NotFoundError('Course content not found for this deck.');
    }

    const systemInstruction = buildFlashcardInstruction(
      courseContent.content,
      topic,
      difficulty
    );

    const prompt = `Generate 10 flashcards on the topic of "${topic}" at ${difficulty} difficulty.`;

    const response = await this.provider.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: flashcardResponseSchema,
        systemInstruction,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = flashcardResponseSchemaZod.parse(JSON.parse(text));

    return FlashcardRepository.addCardsToDeck(deckId, parsed.flashcards);
  }
}

import { ForbiddenError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { buildResearchInstruction } from '../prompts/researchInstruction.prompt';
import { Providers } from '../providers';
import { researchResponseSchema } from '../schema/researchResponse.schema';
import { ResearchRepository } from './research.repository';
import { ResearchResponse, researchResponseSchemaZod } from './research.schema';

export class ResearchService {
  private static provider = Providers.google;
  private static model: string = 'gemini-2.5-flash-lite';

  /**
   * Performs an AI-powered search query. This does NOT save the results.
   * @param userId The ID of the user performing the search.
   * @param courseId The ID of the course for context.
   * @param query The user's search query.
   * @returns A structured list of research findings from the AI.
   */
  public static async performResearch(
    userId: string,
    courseId: string,
    query: string
  ): Promise<ResearchResponse['findings']> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError(
        'You must be enrolled in this course to use the research assistant.'
      );
    }

    const systemInstruction = buildResearchInstruction(query);

    const response = await this.provider.models.generateContent({
      model: this.model,
      contents: 'Generate the research findings now.',
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: researchResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = researchResponseSchemaZod.parse(JSON.parse(text));

    return parsed.findings;
  }

  /**
   * Retrieves a user's research board for a specific course, creating it if needed.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns The research board with all its saved findings.
   */
  public static async getBoard(userId: string, courseId: string) {
    return ResearchRepository.findOrCreateBoard(userId, courseId);
  }
}

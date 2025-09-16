import { ResearchBoard, ResearchFindings } from '../../../db/schema';
import { BadRequestError, ForbiddenError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { buildResearchInstruction } from '../prompts/researchInstruction.prompt';
import { buildSummarizationInstruction } from '../prompts/summarization.prompt';
import { Providers } from '../providers';
import { researchResponseSchema } from '../schema/researchResponse.schema';
import { summaryResponseSchema } from '../schema/summaryResponse.schema';
import { ResearchRepository } from './research.repository';
import {
  FindingData,
  ResearchResponse,
  researchResponseSchemaZod,
  summaryResponseSchemaZod,
} from './research.schema';

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
   * Summarizes a saved research finding by fetching its associated content.
   * @param findingId - The ID of the finding to summarize.
   * @param userId - The ID of the user requesting the summary.
   * @returns The updated research finding with its AI-generated summary.
   */
  public static async summarizeFinding(findingId: string, userId: string) {
    const finding = await ResearchRepository.findFindingById(findingId);
    if (!finding || finding.board.userId !== userId) {
      throw new ForbiddenError();
    }

    if (!finding.url) {
      throw new BadRequestError('Cannot summarize a finding without a URL.');
    }

    const systemInstruction = buildSummarizationInstruction();

    const response = await this.provider.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Please summarize the following web page:\n\n${finding.url}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: summaryResponseSchema,
        systemInstruction,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = summaryResponseSchemaZod.parse(JSON.parse(text));

    return ResearchRepository.updateFindingWithSummary(
      findingId,
      parsed.summary
    );
  }

  /**
   * Retrieves a user's research board for a specific course, creating it if needed.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns The research board with all its saved findings.
   */
  public static async getBoard(
    userId: string,
    courseId: string
  ): Promise<ResearchBoard> {
    return ResearchRepository.findOrCreateBoard(userId, courseId);
  }

  /**
   * Saves a research finding to a user's board.
   * @param userId - The ID of the user.
   * @param courseId - The ID of the course.
   * @param finding - The finding data to save.
   * @returns The saved research finding.
   */
  public static async saveFinding(
    userId: string,
    courseId: string,
    finding: FindingData
  ): Promise<ResearchFindings> {
    const board = await ResearchRepository.findOrCreateBoard(userId, courseId);

    return ResearchRepository.saveFindingToBoard(board.id, finding);
  }

  /**
   * Updates the notes of a research finding.
   * @param findingId - The ID of the finding to update.
   * @param userId - The ID of the user performing the update.
   * @param userNotes - The updated notes, or null to clear them.
   * @returns The updated research finding.
   */
  public static async updateFindingNotes(
    findingId: string,
    userId: string,
    userNotes: string | null
  ): Promise<ResearchFindings> {
    const finding = await ResearchRepository.findFindingById(findingId);
    if (!finding || finding.board.userId !== userId) {
      throw new ForbiddenError();
    }

    return ResearchRepository.updateFindingNotes(findingId, userNotes);
  }

  /**
   * Deletes a research finding from the board.
   * @param findingId - The ID of the finding to delete.
   * @param userId - The ID of the user performing the deletion.
   * @returns Nothing.
   */
  public static async deleteFinding(
    findingId: string,
    userId: string
  ): Promise<void> {
    const finding = await ResearchRepository.findFindingById(findingId);
    if (!finding || finding.board.userId !== userId) {
      throw new ForbiddenError();
    }

    await ResearchRepository.deleteFinding(findingId);
  }
}

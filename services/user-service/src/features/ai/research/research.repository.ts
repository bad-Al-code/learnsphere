import { and, eq } from 'drizzle-orm';
import { db } from '../../../db';
import {
  aiResearchBoards,
  aiResearchFindings,
  ResearchBoard,
  ResearchFindings,
} from '../../../db/schema';
import { FindingData } from './research.schema';

export class ResearchRepository {
  /**
   * Finds a user's research board for a specific course, or creates one if it doesn't exist.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns The user's research board, including all saved findings.
   */
  public static async findOrCreateBoard(
    userId: string,
    courseId: string
  ): Promise<ResearchBoard & { findings: ResearchFindings[] }> {
    const existingBoard = await db.query.aiResearchBoards.findFirst({
      where: and(
        eq(aiResearchBoards.userId, userId),
        eq(aiResearchBoards.courseId, courseId)
      ),
      with: {
        findings: {
          orderBy: (findings, { desc }) => [desc(findings.createdAt)],
        },
      },
    });

    if (existingBoard) {
      return existingBoard;
    }

    const [newBoard] = await db
      .insert(aiResearchBoards)
      .values({ userId, courseId })
      .returning();

    return { ...newBoard, findings: [] };
  }

  /**
   * Saves a new research finding to a given board.
   * @param boardId - The ID of the board to attach the finding to.
   * @param finding - The finding data to save.
   * @returns The saved research finding.
   */
  public static async saveFindingToBoard(
    boardId: string,
    finding: FindingData
  ): Promise<ResearchFindings> {
    const [newFinding] = await db
      .insert(aiResearchFindings)
      .values({ boardId, ...finding })
      .returning();

    return newFinding;
  }

  /**
   * Finds a research finding by its ID, including the associated board.
   * @param findingId - The ID of the finding to look up.
   * @returns The research finding with its board, or null if not found.
   */
  public static async findFindingById(findingId: string) {
    return db.query.aiResearchFindings.findFirst({
      where: eq(aiResearchFindings.id, findingId),
      with: {
        board: true,
      },
    });
  }

  /**
   * Updates the user notes of a research finding.
   * @param findingId - The ID of the finding to update.
   * @param userNotes - The updated notes, or null to clear them.
   * @returns The updated research finding.
   */
  public static async updateFindingNotes(
    findingId: string,
    userNotes: string | null
  ): Promise<ResearchFindings> {
    const [updatedFinding] = await db
      .update(aiResearchFindings)
      .set({ userNotes })
      .where(eq(aiResearchFindings.id, findingId))
      .returning();

    return updatedFinding;
  }

  /**
   * Deletes a research finding permanently.
   * @param findingId - The ID of the finding to delete.
   * @returns Nothing.
   */
  public static async deleteFinding(findingId: string): Promise<void> {
    await db
      .delete(aiResearchFindings)
      .where(eq(aiResearchFindings.id, findingId));
  }

  /**
   * Updates a research finding with an AI-generated summary.
   * @param findingId - The ID of the finding to update.
   * @param summary - The AI-generated summary text.
   * @returns The updated research finding.
   */
  public static async updateFindingWithSummary(
    findingId: string,
    summary: string
  ): Promise<ResearchFindings> {
    const [updatedFinding] = await db
      .update(aiResearchFindings)
      .set({ aiSummary: summary })
      .where(eq(aiResearchFindings.id, findingId))
      .returning();

    return updatedFinding;
  }
}

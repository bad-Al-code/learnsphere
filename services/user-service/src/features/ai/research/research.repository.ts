import { and, eq } from 'drizzle-orm';
import { db } from '../../../db';
import { aiResearchBoards } from '../../../db/schema';

export class ResearchRepository {
  /**
   * Finds a user's research board for a specific course, or creates one if it doesn't exist.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns The user's research board, including all saved findings.
   */
  public static async findOrCreateBoard(userId: string, courseId: string) {
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
}

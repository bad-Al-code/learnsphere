import { desc, eq } from 'drizzle-orm';
import { db } from '..';
import {
  AssignmentDraft,
  assignmentDrafts,
  NewAssignmentDraft,
} from '../schema';

export class DraftRepository {
  /**
   * Finds all drafts for a specific student, ordered by last saved date descending.
   * @param studentId - The ID of the student.
   * @returns A list of assignment drafts.
   */
  public static async findByStudentId(
    studentId: string
  ): Promise<AssignmentDraft[]> {
    return db.query.assignmentDrafts.findMany({
      where: eq(assignmentDrafts.studentId, studentId),
      orderBy: [desc(assignmentDrafts.lastSaved)],
    });
  }

  /**
   * Creates a new assignment draft.
   * @param data - The data for the new draft.
   * @returns The newly created assignment draft.
   */
  public static async create(
    data: NewAssignmentDraft
  ): Promise<AssignmentDraft> {
    const [newDraft] = await db
      .insert(assignmentDrafts)
      .values(data)
      .returning();
    return newDraft;
  }

  /**
   * Updates an existing assignment draft.
   * @param draftId - The ID of the draft to update.
   * @param data - Partial data to update the draft with.
   * @returns The updated assignment draft.
   */
  public static async update(
    draftId: string,
    data: Partial<NewAssignmentDraft>
  ): Promise<AssignmentDraft> {
    const [updateDraft] = await db
      .update(assignmentDrafts)
      .set({ ...data, lastSaved: new Date() })
      .where(eq(assignmentDrafts.id, draftId))
      .returning();

    return updateDraft;
  }

  /**
   * Deletes an assignment draft by ID.
   * @param draftId - The ID of the draft to delete.
   */
  public static async delete(draftId: string): Promise<void> {
    await db.delete(assignmentDrafts).where(eq(assignmentDrafts.id, draftId));
  }

  /**
   * Finds a draft by its ID.
   * @param draftId - The ID of the draft.
   * @returns The assignment draft if found, otherwise undefined.
   */
  public static async findById(
    draftId: string
  ): Promise<AssignmentDraft | undefined> {
    return db.query.assignmentDrafts.findFirst({
      where: eq(assignmentDrafts.id, draftId),
    });
  }
}

import { and, desc, eq } from 'drizzle-orm';
import { db } from '..';
import {
  AssignmentDraft,
  assignmentDrafts,
  NewAssignmentDraft,
} from '../schema';

export class DraftRepository {
  /**
   * Find the first draft for a given assignment and student.
   * @param assignmentId - The ID of the assignment
   * @param studentId - The ID of the student
   * @returns A promise that resolves to the assignment draft if found, otherwise null
   */
  public static async findByAssignmentAndStudent(
    assignmentId: string,
    studentId: string
  ): Promise<AssignmentDraft | undefined> {
    return db.query.assignmentDrafts.findFirst({
      where: and(
        eq(assignmentDrafts.assignmentId, assignmentId),
        eq(assignmentDrafts.studentId, studentId)
      ),
    });
  }

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

  /**
   * Adds a collaborator to the specified draft.
   * @param draftId - The ID of the draft to update.
   * @param collaboratorId - The ID of the collaborator to add.
   * @returns A promise that resolves when the collaborator has been added.
   */
  public static async addCollaborator(
    draftId: string,
    collaboratorId: string
  ): Promise<void> {
    const draft = await db
      .select({ collaborators: assignmentDrafts.collaborators })
      .from(assignmentDrafts)
      .where(eq(assignmentDrafts.id, draftId))
      .limit(1);

    if (!draft.length) {
      throw new Error('Draft not found');
    }

    const currentCollaborators = draft[0].collaborators || [];
    const updatedCollaborators = [
      ...new Set([...currentCollaborators, collaboratorId]),
    ];

    await db
      .update(assignmentDrafts)
      .set({
        collaborators: updatedCollaborators,
        lastSaved: new Date(),
      })
      .where(eq(assignmentDrafts.id, draftId));
  }

  /**
   * Checks if a given user is a collaborator on a specific draft.
   * @param draftId - The ID of the draft to check
   * @param userId - The ID of the user to verify
   * @returns A promise that resolves to `true` if the user is a collaborator, or `false` otherwise
   */
  public static async isUserCollaborator(
    draftId: string,
    userId: string
  ): Promise<boolean> {
    const draft = await db
      .select({ collaborators: assignmentDrafts.collaborators })
      .from(assignmentDrafts)
      .where(eq(assignmentDrafts.id, draftId))
      .limit(1);

    if (!draft.length) {
      return false;
    }

    const collaborators = draft[0].collaborators || [];
    return collaborators.includes(userId);
  }
}

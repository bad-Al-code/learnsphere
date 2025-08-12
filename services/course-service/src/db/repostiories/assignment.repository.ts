import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { Assignment, NewAssignment, UpdateAssignmentDto } from '../../schemas';
import { assignments } from '../schema';

export class AssignmentRepository {
  /**
   * Creates a new assignment record in the database.
   * @param {NewAssignment} data - The data for the new assignment.
   * @returns {Promise<Assignment>} The newly created assignment.
   */
  public static async create(data: NewAssignment): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(data)
      .returning();

    return newAssignment;
  }

  /**
   * Finds an assignment by its unique identifier.
   * @param {string} id - The ID of the assignment to find.
   * @returns {Promise<Assignment | undefined>} The found assignment, or undefined if not found.
   */
  public static async findById(id: string): Promise<Assignment | undefined> {
    return db.query.assignments.findFirst({
      where: eq(assignments.id, id),
    });
  }

  /**
   * Updates an existing assignment by its ID.
   * @param {string} id - The ID of the assignment to update.
   * @param {Partial<UpdateAssignmentDto>} data - Partial data to update the assignment.
   * @returns {Promise<Assignment | null>} The updated assignment or null if not found.
   */
  public static async update(
    id: string,
    data: Partial<UpdateAssignmentDto>
  ): Promise<Assignment | null> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(assignments.id, id))
      .returning();

    return updatedAssignment || null;
  }

  /**
   * Deletes an assignment by its ID.
   * @param {string} id - The ID of the assignment to delete.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  public static async delete(id: string): Promise<void> {
    await db.delete(assignments).where(eq(assignments.id, id));
  }

  /**
   * Reorders multiple assignments within a module.
   * @param {Array<{ id: string; order: number }>} items - Array of assignments with new order values.
   * @param {string} moduleId - The module ID to which these assignments belong.
   * @returns {Promise<void>} Resolves when all reorder updates are complete.
   */
  public static async reorder(
    items: { id: string; order: number }[],
    moduleId: string
  ): Promise<void> {
    const queries = items.map((item) =>
      db
        .update(assignments)
        .set({ order: item.order })
        .where(
          and(eq(assignments.id, item.id), eq(assignments.moduleId, moduleId))
        )
    );

    await db.transaction(async (tx) => {
      await Promise.all(queries.map((q) => tx.execute(q)));
    });
  }
}

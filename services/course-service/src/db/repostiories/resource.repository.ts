import { count, desc, eq } from 'drizzle-orm';
import { db } from '..';
import { NewResource, Resource, UpdateResourceDto } from '../../schemas';
import { resources } from '../schema';

/**
 * Repository for interacting with the `resources` table.
 */
export class ResourceRepository {
  /**
   * Create a new resource record.
   * @param data Resource data to insert.
   * @returns The newly created Resource.
   */
  public static async create(data: NewResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(data).returning();
    return newResource;
  }

  /**
   * Find a resource by its ID.
   * @param id Resource ID.
   * @returns Resource or undefined if not found.
   */
  public static async findById(id: string): Promise<Resource | undefined> {
    return db.query.resources.findFirst({ where: eq(resources.id, id) });
  }

  /**
   * Get all resources for a given course.
   * @param courseId Course ID.
   * @param limit
   * @param page
   * @returns List of Resources ordered by creation date (descending).
   */
  public static async findByCourseId(
    courseId: string,
    page: number,
    limit: number
  ) {
    const offset = (page - 1) * limit;
    const totalQuery = db
      .select({ value: count() })
      .from(resources)
      .where(eq(resources.courseId, courseId));
    const resultsQuery = db.query.resources.findMany({
      where: eq(resources.courseId, courseId),
      orderBy: [desc(resources.createdAt)],
      limit,
      offset,
    });
    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultsQuery,
    ]);
    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
      },
    };
  }

  /**
   * Update a resource by ID.
   * @param id Resource ID.
   * @param data Partial update payload.
   * @returns Updated resource or null if not found.
   */
  public static async update(
    id: string,
    data: UpdateResourceDto
  ): Promise<Resource | null> {
    const [updatedResource] = await db
      .update(resources)
      .set(data)
      .where(eq(resources.id, id))
      .returning();
    return updatedResource || null;
  }

  /**
   * Delete a resource by ID.
   * @param id Resource ID.
   */
  public static async delete(id: string): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }
}

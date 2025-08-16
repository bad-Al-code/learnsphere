import { asc, count, eq, inArray } from 'drizzle-orm';

import { db } from '..';
import { Module, NewModule, UpdateModuleDto } from '../../types';
import { lessons, modules } from '../schema';

export class ModuleRepository {
  /**
   * Creates a new module.
   * @param data - The data for the new module.
   * @returns The newly created module object.
   */
  public static async create(data: NewModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(data).returning();
    return newModule;
  }

  /**
   * Finds a single module by its ID, including its parent course for auth checks.
   * @param moduleId - The ID of the module to find.
   * @returns The module object with its parent course, or undefined.
   */
  public static async findById(moduleId: string) {
    return db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: {
        course: true,
        assignments: {
          orderBy: (assignments, { asc }) => [asc(assignments.order)],
        },
      },
    });
  }

  /**
   * Finds multiple modules by their IDs, including their parent courses.
   * @param moduleIds - An array of module IDs.
   * @returns An array of module objects with their parent courses.
   */
  public static async findManyByIdsWithCourse(moduleIds: string[]) {
    if (moduleIds.length === 0) return [];
    return db.query.modules.findMany({
      where: inArray(modules.id, moduleIds),
      with: { course: true },
    });
  }

  /**
   * Finds a single module by its ID, including all of its lessons.
   * @param moduleId - The ID of the module to find.
   * @returns The module object with a nested array of lessons, or undefined.
   */
  public static async findByIdWithLessons(moduleId: string) {
    return db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: {
        lessons: {
          orderBy: [asc(lessons.order)],
        },
      },
    });
  }

  /**
   * Finds all modules belonging to a specific course.
   * @param courseId - The ID of the parent course.
   * @returns An array of module objects, ordered correctly.
   */
  public static async findManyByCourseId(courseId: string): Promise<Module[]> {
    return db.query.modules.findMany({
      where: eq(modules.courseId, courseId),
      orderBy: [asc(modules.order)],
    });
  }

  /**
   * Counts the number of modules in a specific course.
   * @param courseId - The ID of the parent course.
   * @returns The total number of modules.
   */
  public static async countByCourseId(courseId: string): Promise<number> {
    const [{ value }] = await db
      .select({ value: count() })
      .from(modules)
      .where(eq(modules.courseId, courseId));
    return value;
  }

  /**
   * Updates a module's data.
   * @param moduleId - The ID of the module to update.
   * @param data - An object containing the fields to update.
   * @returns The updated module object.
   */
  public static async update(
    moduleId: string,
    data: UpdateModuleDto
  ): Promise<Module> {
    const [updatedModule] = await db
      .update(modules)
      .set(data)
      .where(eq(modules.id, moduleId))
      .returning();
    return updatedModule;
  }

  /**
   * Deletes a module by its ID.
   * @param moduleId - The ID of the module to delete.
   */
  public static async delete(moduleId: string): Promise<void> {
    await db.delete(modules).where(eq(modules.id, moduleId));
  }

  /**
   * Finds multiple modules by their IDs, selecting only title and id.
   * @param moduleIds - An array of module IDs.
   * @returns An array of module objects with just id and title.
   */
  public static async findManyByIdsSimple(moduleIds: string[]) {
    if (moduleIds.length === 0) return [];

    return db
      .select({ id: modules.id, title: modules.title })
      .from(modules)
      .where(inArray(modules.id, moduleIds));
  }
}

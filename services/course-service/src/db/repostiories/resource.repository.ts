import { desc, eq } from 'drizzle-orm';
import { db } from '..';
import { NewResource, Resource, UpdateResourceDto } from '../../schemas';
import { resources } from '../schema';

export class ResourceRepository {
  public static async create(data: NewResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(data).returning();
    return newResource;
  }

  public static async findById(id: string): Promise<Resource | undefined> {
    return db.query.resources.findFirst({ where: eq(resources.id, id) });
  }

  public static async findByCourseId(courseId: string): Promise<Resource[]> {
    return db.query.resources.findMany({
      where: eq(resources.courseId, courseId),
      orderBy: [desc(resources.createdAt)],
    });
  }

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

  public static async delete(id: string): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }
}

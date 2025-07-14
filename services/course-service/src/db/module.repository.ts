import { asc, count, eq } from "drizzle-orm";

import { db } from ".";
import { Module, NewModule } from "../types";
import { modules } from "./schema";

export class ModuleRepository {
  public static async create(data: NewModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(data).returning();

    return newModule;
  }

  public static async findById(moduleId: string) {
    return db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: { course: true },
    });
  }

  public static async findManyByCourseId(courseId: string): Promise<Module[]> {
    return db.query.modules.findMany({
      where: eq(modules.courseId, courseId),
      orderBy: [asc(modules.order)],
    });
  }

  public static async coundByCourseId(courseId: string): Promise<number> {
    const [{ value }] = await db
      .select({ value: count() })
      .from(modules)
      .where(eq(modules.courseId, courseId));

    return value;
  }
}

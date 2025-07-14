import { eq } from "drizzle-orm";

import { db } from ".";
import { Lesson, NewLesson } from "../types";
import { lessons, textLessonContent } from "./schema";

export class LessonRepository {
  public static async create(data: NewLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(data).returning();

    return newLesson;
  }

  public static async findById(lessonId: string) {
    return db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { module: { with: { course: true } } },
    });
  }

  public static async findByIdWithContent(lessonId: string) {
    return db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: { textContent: true },
    });
  }

  public static async createTextContent(
    lessonId: string,
    content: string
  ): Promise<void> {
    await db.insert(textLessonContent).values({ lessonId, content });
  }

  public static async updateTextContent(
    lessonId: string,
    content: string
  ): Promise<void> {
    await db
      .insert(textLessonContent)
      .values({ lessonId, content })
      .onConflictDoUpdate({
        target: textLessonContent.lessonId,
        set: { content },
      });
  }
}

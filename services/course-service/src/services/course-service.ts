import { eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { courses, lessons, modules } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../errors";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
}

interface CreateModuleData {
  id: string;
  title: string;
  courseId: string;
}

interface CreateLessonData {
  id: string;
  title: string;
  moduleId: string;
  lessonType: "video" | "quiz" | "text";
}

export class CourseService {
  public static async createCourse(data: CreateCourseData) {
    logger.info(`Creating a new course`, {
      title: data.title,
      instructorId: data.instructorId,
    });

    const newCourse = await db
      .insert(courses)
      .values({
        title: data.title,
        description: data.description,
        instructorId: data.instructorId,
      })
      .returning();

    return newCourse[0];
  }

  public static async getAllCourses(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const allCourses = await db.query.courses.findMany({
      limit,
      offset,
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    return allCourses;
  }

  public static async getCourseById(courseId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: (modules, { asc }) => [asc(modules.order)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.order)],
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundError("Course");
    }

    return course;
  }

  public static async updateCourse(
    courseId: string,
    data: Partial<CreateCourseData>,
    userId: string,
    userRole: string
  ) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      columns: { instructorId: true },
    });

    if (!course) {
      throw new NotFoundError("Course");
    }

    if (userRole !== "admin" && course.instructorId !== userId) {
      throw new ForbiddenError();
    }

    logger.info(`Updating course ${courseId} by user ${userId}`);

    const updatedCourse = await db
      .update(courses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse[0];
  }

  public static async createModule(
    data: CreateModuleData,
    userId: string,
    userRole: string
  ) {
    await this.verifyCourseOwnership(data.courseId, userId, userRole);

    // TODO: add logic to determine the 'order' of the new module
    const newModule = await db.insert(modules).values(data).returning();
    return newModule[0];
  }

  public static async updateModule(
    moduleId: string,
    data: Partial<CreateModuleData>,
    userId: string,
    userRole: string
  ) {
    const module = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId),
      with: { course: { columns: { instructorId: true } } },
    });

    if (!module) {
      throw new NotFoundError("Module");
    }

    if (userRole !== "admin" && module.course.instructorId !== userId) {
      throw new ForbiddenError();
    }

    const updatedModule = await db
      .update(modules)
      .set(data)
      .where(eq(modules.id, moduleId))
      .returning();

    return updatedModule[0];
  }

  public static async createLesson(
    data: CreateLessonData,
    userId: string,
    userRole: string
  ) {
    const module = await db.query.modules.findFirst({
      where: eq(modules.id, data.moduleId),
      with: { course: { columns: { instructorId: true } } },
    });

    if (!module) {
      throw new NotFoundError("Module");
    }
    if (userRole !== "admin" && module.course.instructorId !== userId) {
      throw new ForbiddenError();
    }

    // TODO: determin the 'order' of the new lesson
    const newLestion = await db.insert(lessons).values(data).returning();

    return newLestion[0];
  }

  public static async updateLesson(
    lessonId: string,
    data: Partial<CreateLessonData>,
    userId: string,
    userRole: string
  ) {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
      with: {
        module: { with: { course: { columns: { instructorId: true } } } },
      },
    });
    if (!lesson) {
      throw new NotFoundError("Lesson");
    }
    if (userRole !== "admin" && lesson.module.course.instructorId !== userId) {
      throw new ForbiddenError();
    }

    const updatedLesson = await db
      .update(lessons)
      .set(data)
      .where(eq(lessons.id, lessonId))
      .returning();

    return updatedLesson[0];
  }

  private static async verifyCourseOwnership(
    courseId: string,
    userId: string,
    userRole: string
  ) {
    if (userRole === "admin") {
      return;
    }

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      columns: { instructorId: true },
    });

    if (!course) {
      throw new NotFoundError("Course");
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenError();
    }
  }
}

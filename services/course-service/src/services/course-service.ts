import { asc, count, eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { courses, lessons, modules } from "../db/schema";
import { ForbiddenError, NotFoundError } from "../errors";

interface CreateCourseData {
  title: string;
  description?: string;
  instructorId: string;
}

interface ModuleData {
  title: string;
  courseId: string;
}

interface LessonData {
  title: string;
  moduleId: string;
  lessonType: "video" | "text" | "quiz";
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

  public static async addModuleToCourse(data: ModuleData, requesterId: string) {
    logger.info(`Adding module "${data.title}" to course ${data.courseId}`);

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data.courseId),
    });

    if (!course) {
      throw new NotFoundError("Course");
    }

    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const newModule = await db
      .insert(modules)
      .values({
        title: data.title,
        courseId: data.courseId,
      })
      .returning();

    return newModule[0];
  }

  public static async addLessonToModule(data: LessonData, requesterId: string) {
    logger.info(`Adding lesson "${data.title}" to moduke ${data.moduleId}`);

    const parentModule = await db.query.modules.findFirst({
      where: eq(modules.id, data.moduleId),
      with: {
        course: true,
      },
    });

    if (!parentModule) {
      throw new NotFoundError("Module");
    }

    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const newLesson = await db
      .insert(lessons)
      .values({
        title: data.title,
        moduleId: data.moduleId,
        lessonType: data.lessonType,
      })
      .returning();

    return newLesson[0];
  }

  public static async listCourses(page: number, limit: number) {
    logger.info(`Fetching courses list for page: ${page}, limit: ${limit}`);

    const offset = (page - 1) * limit;

    const totalCourseQuery = db.select({ value: count() }).from(courses);

    const courseQuery = db.query.courses.findMany({
      limit,
      offset,
    });

    const [total, courseList] = await Promise.all([
      totalCourseQuery,
      courseQuery,
    ]);

    const totalResult = total[0].value;
    const totalPages = Math.ceil(totalResult / limit);

    return {
      results: courseList,
      pagination: {
        currentPage: page,
        totalPages,
        totalResult,
      },
    };
  }

  public static async getCourseDetails(courseId: string) {
    logger.info(`Fetching full details for course: ${courseId}`);

    const courseDetails = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        modules: {
          orderBy: [asc(modules.order)],
          with: {
            lessons: {
              orderBy: [asc(lessons.order)],
            },
          },
        },
      },
    });

    if (!courseDetails) {
      throw new NotFoundError("Course");
    }

    return courseDetails;
  }
}

import { eq } from 'drizzle-orm';
import logger from '../config/logger';
import { db } from '../db';
import { ModuleRepository } from '../db/repostiories/module.repository';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { CreateLessonDto, UpdateLessonDto } from '../types';
import { lessons } from '../db/schema';
import { LessonRepository } from '../db/repostiories/lesson.repository';
import { CacheService } from './cache.service';

export class LessonService {
  public static async addLessonToModule(
    data: CreateLessonDto,
    requesterId: string
  ) {
    logger.info(`Adding lesson "${data.title}" to module ${data.moduleId}`);

    const parentModule = await ModuleRepository.findById(data.moduleId);
    if (!parentModule) {
      throw new NotFoundError('Module');
    }
    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    return db.transaction(async (tx) => {
      const lessonCount = await tx
        .select({ value: eq(lessons.moduleId, data.moduleId) })
        .from(lessons);
      const nextOrder = lessonCount.length;

      const [newLesson] = await tx
        .insert(lessons)
        .values({
          title: data.title,
          moduleId: data.moduleId,
          lessonType: data.lessonType,
          order: nextOrder,
        })
        .returning();

      if (
        data.lessonType === 'text' &&
        data.content &&
        data.content.length > 0
      ) {
        await LessonRepository.createTextContent(newLesson.id, data.content);
      }

      await CacheService.del(`course:details:${parentModule.courseId}`);

      return LessonRepository.findByIdWithContent(newLesson.id);
    });
  }

  public static async getLessonDetails(lessonId: string) {
    logger.info(`Fetching details for lesson: ${lessonId}`);

    const lessonDetails = await LessonRepository.findByIdWithContent(lessonId);
    if (!lessonDetails) {
      throw new NotFoundError('Lesson');
    }

    return lessonDetails;
  }

  public static async updateLesson(
    lessonId: string,
    data: UpdateLessonDto,
    requesterId: string
  ) {
    const lesson = await LessonRepository.findById(lessonId);
    if (!lesson) throw new NotFoundError('Lesson');
    if (lesson.module.course.instructorId !== requesterId)
      throw new ForbiddenError();

    await db.transaction(async (_tx) => {
      const { content, ...lessonData } = data;
      if (Object.keys(lessonData).length > 0) {
        await LessonRepository.update(lessonId, lessonData);
      }
      if (lesson.lessonType === 'text' && typeof content !== 'undefined') {
        await LessonRepository.upsertTextContent(lessonId, content);
      }
    });

    await CacheService.del(`course:details:${lesson.module.courseId}`);
    return this.getLessonDetails(lessonId);
  }

  public static async deleteLesson(
    lessonId: string,
    requesterId: string
  ): Promise<void> {
    const lesson = await LessonRepository.findById(lessonId);
    if (!lesson) throw new NotFoundError('Lesson');
    if (lesson.module.course.instructorId !== requesterId)
      throw new ForbiddenError();

    await LessonRepository.delete(lessonId);

    await CacheService.del(`course:details:${lesson.module.courseId}`);
    logger.info(`Deleted lesson ${lessonId} by user ${requesterId}`);
  }

  public static async reorderLessons(
    orderedLessonIds: string[],
    requesterId: string
  ): Promise<void> {
    if (orderedLessonIds.length === 0) return;

    await db.transaction(async (tx) => {
      const allLessons =
        await LessonRepository.findManyByIdsWithModule(orderedLessonIds);

      if (allLessons.length !== orderedLessonIds.length) {
        throw new BadRequestError('One or more lesson IDs are invalid.');
      }

      const parentModule = allLessons[0].module;
      if (!parentModule || !parentModule.course)
        throw new Error('Lesson relation corrupted.');
      if (parentModule.course.instructorId !== requesterId)
        throw new ForbiddenError();

      const allFromSameModule = allLessons.every(
        (l) => l.moduleId === parentModule.id
      );
      if (!allFromSameModule) throw new ForbiddenError();

      logger.info(
        `Reordering ${allLessons.length} lessons for module ${parentModule.id}`
      );
      const updatePromises = orderedLessonIds.map((id, index) =>
        tx.update(lessons).set({ order: index }).where(eq(lessons.id, id))
      );

      await Promise.all(updatePromises);
      await CacheService.del(`course:details:${parentModule.courseId}`);
    });
  }
}

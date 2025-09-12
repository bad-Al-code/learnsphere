import { count, eq } from 'drizzle-orm';

import { MediaClient } from '../clients/media.client';
import logger from '../config/logger';
import { db } from '../db';
import { LessonRepository } from '../db/repostiories/lesson.repository';
import { ModuleRepository } from '../db/repostiories/module.repository';
import { lessons, textLessonContent } from '../db/schema';
import { BadRequestError, NotFoundError } from '../errors';
import { CreateLessonDto, lessonCreateSchema } from '../schemas';
import { Requester, UpdateLessonDto } from '../types';
import { AuthorizationService } from './authorization.service';
import { CourseCacheService } from './course-cache.service';
import { CourseService } from './course.service';

export class LessonService {
  /**
   * Add lessons to modules.
   * @param data
   * @param requesterId
   * @returns
   */
  public static async addLessonToModule(
    data: CreateLessonDto,

    requester: Requester
  ) {
    const validatedData = lessonCreateSchema.parse(data);

    logger.info(
      `Adding lesson "${validatedData.title}" to module ${validatedData.moduleId}`
    );

    await AuthorizationService.verifyModuleOwnership(
      validatedData.moduleId,
      requester
    );

    const parentModule = await ModuleRepository.findById(
      validatedData.moduleId
    );
    if (!parentModule) {
      throw new NotFoundError('Module');
    }

    const newLessonWithContent = await db.transaction(async (tx) => {
      const lessonCountResult = await tx
        .select({ value: count() })
        .from(lessons)
        .where(eq(lessons.moduleId, validatedData.moduleId));

      const nextOrder = lessonCountResult[0].value;

      const [newLesson] = await tx
        .insert(lessons)
        .values({
          title: validatedData.title,
          moduleId: validatedData.moduleId,
          lessonType: validatedData.lessonType,
          order: nextOrder,
          isPublished: validatedData.isPublished,
          duration: validatedData.duration,
        })
        .returning();

      if (
        validatedData.lessonType === 'text' &&
        validatedData.content &&
        validatedData.content.length > 0
      ) {
        await tx
          .insert(textLessonContent)
          .values({ lessonId: newLesson.id, content: validatedData.content });
      }

      const fullLesson = await tx.query.lessons.findFirst({
        where: eq(lessons.id, newLesson.id),
        with: { textContent: true, module: true },
      });

      return fullLesson;
    });

    await CourseCacheService.invalidateCacheDetails(parentModule.courseId);

    if (validatedData.lessonType === 'text') {
      await CourseService.publishCourseContentUpdate(parentModule.courseId);
    }

    return newLessonWithContent;
  }

  /**
   * Get lesson details
   * @param lessonId
   * @returns
   */
  public static async getLessonDetails(lessonId: string) {
    logger.info(`Fetching details for lesson: ${lessonId}`);

    const lessonDetails = await LessonRepository.findByIdWithContent(lessonId);
    if (!lessonDetails) {
      throw new NotFoundError('Lesson');
    }

    return lessonDetails;
  }

  /**
   * Update Lesson
   * @param lessonId
   * @param data
   * @param requesterId
   * @returns
   */
  public static async updateLesson(
    lessonId: string,
    data: UpdateLessonDto,
    requester: Requester
  ) {
    await AuthorizationService.verifyLessonOwnership(lessonId, requester);

    const lesson = await LessonRepository.findById(lessonId);
    if (!lesson) throw new NotFoundError('Lesson');

    await db.transaction(async (tx) => {
      const { content, ...lessonData } = data;
      if (Object.keys(lessonData).length > 0) {
        await tx
          .update(lessons)
          .set(lessonData)
          .where(eq(lessons.id, lessonId));
      }
      if (lesson.lessonType === 'text' && typeof content !== 'undefined') {
        await tx
          .insert(textLessonContent)
          .values({ lessonId, content })
          .onConflictDoUpdate({
            target: textLessonContent.lessonId,
            set: { content },
          });
      }
    });

    await CourseCacheService.invalidateCacheDetails(lesson.module.courseId);

    if (lesson.lessonType === 'text') {
      await CourseService.publishCourseContentUpdate(lesson.module.courseId);
    }

    return this.getLessonDetails(lessonId);
  }

  /**
   * Delete Lesson
   * @param lessonId
   * @param requesterId
   */
  public static async deleteLesson(
    lessonId: string,
    requester: Requester
  ): Promise<void> {
    const lesson = await LessonRepository.findById(lessonId);
    if (!lesson) throw new NotFoundError('Lesson');
    await AuthorizationService.verifyLessonOwnership(lessonId, requester);

    await LessonRepository.delete(lessonId);

    await CourseCacheService.invalidateCacheDetails(lesson.module.courseId);

    if (lesson.lessonType === 'text') {
      await CourseService.publishCourseContentUpdate(lesson.module.courseId);
    }

    logger.info(`Deleted lesson ${lessonId} by user ${requester}`);
  }

  /**
   * Reorder Lesson
   * @param orderedLessonIds
   * @param requesterId
   * @returns
   */
  public static async reorderLessons(
    orderedLessonIds: string[],
    requester: Requester
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
      await AuthorizationService.verifyModuleOwnership(
        parentModule.id,
        requester
      );

      const allFromSameModule = allLessons.every(
        (l) => l.moduleId === parentModule.id
      );
      if (!allFromSameModule) {
        throw new BadRequestError(
          'All lessons must belong to the same module for reordering.'
        );
      }

      logger.info(
        `Reordering ${allLessons.length} lessons for module ${parentModule.id}`
      );
      const updatePromises = orderedLessonIds.map((id, index) =>
        tx.update(lessons).set({ order: index }).where(eq(lessons.id, id))
      );

      await Promise.all(updatePromises);

      await CourseCacheService.invalidateCacheDetails(parentModule.courseId);
      await CourseService.publishCourseContentUpdate(parentModule.courseId);
    });
  }

  /**
   * Request Video upload url
   * @param lessonId
   * @param filename
   * @param requesterId
   * @returns
   */
  public static async requestVideoUploadUrl(
    lessonId: string,
    filename: string,
    requester: Requester
  ) {
    await AuthorizationService.verifyLessonOwnership(lessonId, requester);

    const lesson = await LessonRepository.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson');
    }

    if (lesson.lessonType !== 'video') {
      throw new BadRequestError('This lesson is not a video lesson');
    }

    return MediaClient.requestVideoUploadUrl(lessonId, filename);
  }
}

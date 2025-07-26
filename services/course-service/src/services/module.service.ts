import { eq } from 'drizzle-orm';

import logger from '../config/logger';
import { db } from '../db';
import { CourseRepository } from '../db/repostiories';
import { ModuleRepository } from '../db/repostiories/module.repository';
import { modules } from '../db/schema';
import { BadRequestError, NotFoundError } from '../errors';
import { CreateModuleDto, UpdateModuleDto } from '../types';
import { AuthorizationService } from './authorization.service';
import { CourseCacheService } from './course-cache.service';

export class ModuleService {
  public static async addModuleToCourse(
    data: CreateModuleDto,
    requesterId: string
  ) {
    await AuthorizationService.verifyCourseOwnership(
      data.courseId,
      requesterId
    );

    logger.info(`Adding module "${data.title}" to course ${data.courseId}`);

    const nextOrder = await ModuleRepository.countByCourseId(data.courseId);

    const newModule = await ModuleRepository.create({
      ...data,
      order: nextOrder,
    });

    await CourseCacheService.invalidateCacheDetails(data.courseId);

    return newModule;
  }

  public static async getModulesForCourses(courseId: string) {
    logger.info(`Fetching all modules for course: ${courseId}`);

    const courseExists = await CourseRepository.findById(courseId);
    if (!courseExists) {
      throw new NotFoundError('Course');
    }

    return ModuleRepository.findManyByCourseId(courseId);
  }

  public static async getModuleDetails(moduleId: string) {
    logger.info(`Fetching details for module: ${moduleId}`);

    const moduleDetails = await ModuleRepository.findByIdWithLessons(moduleId);
    if (!moduleDetails) {
      throw new NotFoundError('Module');
    }
    return moduleDetails;
  }

  public static async updateModule(
    moduleId: string,
    data: UpdateModuleDto,
    requesterId: string
  ) {
    await AuthorizationService.verifyModuleOwnership(moduleId, requesterId);

    const updatedModule = await ModuleRepository.update(moduleId, data);
    const parentCourseId = (await ModuleRepository.findById(moduleId))!.course
      .id;

    await CourseCacheService.invalidateCacheDetails(parentCourseId);

    return updatedModule;
  }

  public static async deleteModule(moduleId: string, requesterId: string) {
    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) {
      throw new NotFoundError('Module');
    }
    await AuthorizationService.verifyModuleOwnership(moduleId, requesterId);

    await ModuleRepository.delete(moduleId);

    await CourseCacheService.invalidateCacheDetails(parentModule.courseId);

    logger.info(`Deleted module ${moduleId} by user ${requesterId}`);
  }

  public static async reorderModules(
    orderModuleIds: string[],
    requesterId: string
  ): Promise<void> {
    if (orderModuleIds.length === 0) {
      return;
    }

    await db.transaction(async (tx) => {
      const allModules =
        await ModuleRepository.findManyByIdsWithCourse(orderModuleIds);

      if (allModules.length !== orderModuleIds.length) {
        throw new BadRequestError('One or more moduls IDs are invalid');
      }

      const parentCourseId = allModules[0].course.id;
      await AuthorizationService.verifyCourseOwnership(
        parentCourseId,
        requesterId
      );

      const allModulesFromSameCourse = allModules.every(
        (m) => m.courseId === parentCourseId
      );
      if (!allModulesFromSameCourse) {
        throw new BadRequestError(
          'All modules must belong to the same course.'
        );
      }

      logger.info(
        `Reordering ${allModules.length} modules for course ${parentCourseId}`
      );

      const updatePromises = orderModuleIds.map((id, index) => {
        return tx
          .update(modules)
          .set({ order: index })
          .where(eq(modules.id, id));
      });

      await Promise.all(updatePromises);
      await CourseCacheService.invalidateCacheDetails(parentCourseId);
    });
  }
}

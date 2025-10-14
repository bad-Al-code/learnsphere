import { eq } from 'drizzle-orm';

import logger from '../config/logger';
import { db } from '../db';
import { CourseRepository } from '../db/repostiories';
import { ModuleRepository } from '../db/repostiories/module.repository';
import { modules } from '../db/schema';
import { BadRequestError, NotFoundError } from '../errors';
import {
  CreateModuleDto,
  moduleCreateSchema,
  moduleUpdateSchema,
} from '../schemas';
import { Requester, UpdateModuleDto } from '../types';
import { AuthorizationService } from './authorization.service';
import { CourseCacheService } from './course-cache.service';
import { CourseService } from './course.service';

export class ModuleService {
  public static async addModuleToCourse(
    data: CreateModuleDto,
    requester: Requester
  ) {
    const validatedData = moduleCreateSchema.parse(data);

    await AuthorizationService.verifyCourseOwnership(
      validatedData.courseId,
      requester
    );

    logger.info(
      `Adding module "${data.title}" to course ${validatedData.courseId}`
    );

    const nextOrder = await ModuleRepository.countByCourseId(
      validatedData.courseId
    );

    const newModule = await ModuleRepository.create({
      title: validatedData.title,
      courseId: validatedData.courseId,
      isPublished: validatedData.isPublished,
      order: nextOrder,
    });

    await CourseCacheService.invalidateCacheDetails(data.courseId);
    await CourseService.publishCourseContentUpdate(data.courseId);

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
    requester: Requester
  ) {
    await AuthorizationService.verifyModuleOwnership(moduleId, requester);

    const validatedData = moduleUpdateSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
      throw new BadRequestError('No valid fields provided for update.');
    }

    const updatedModule = await ModuleRepository.update(
      moduleId,
      validatedData
    );

    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) {
      throw new NotFoundError('Module');
    }

    await CourseCacheService.invalidateCacheDetails(parentModule.course.id);
    await CourseService.publishCourseContentUpdate(parentModule.course.id);

    return updatedModule;
  }

  public static async deleteModule(moduleId: string, requester: Requester) {
    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) {
      throw new NotFoundError('Module');
    }
    await AuthorizationService.verifyModuleOwnership(moduleId, requester);

    await ModuleRepository.delete(moduleId);

    await CourseCacheService.invalidateCacheDetails(parentModule.courseId);
    await CourseService.publishCourseContentUpdate(parentModule.courseId);

    logger.info(`Deleted module ${moduleId} by user ${requester}`);
  }

  public static async reorderModules(
    orderModuleIds: string[],
    requester: Requester
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
        requester
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
      await CourseService.publishCourseContentUpdate(parentCourseId);
    });
  }

  /**
   * Retrieves multiple modules by their IDs, returning only essential information.
   * @param  moduleIds - An array of module IDs.
   * @returns A promise that resolves to a list of simplified module objects.
   */
  public static async getModulesByIds(
    moduleIds: string[]
  ): Promise<{ id: string; title: string | null }[]> {
    if (moduleIds.length === 0) {
      return [];
    }
    logger.info(`Fetching details for ${moduleIds.length} modules in bulk`);
    return ModuleRepository.findManyByIdsSimple(moduleIds);
  }
}

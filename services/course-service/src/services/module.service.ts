import { eq } from 'drizzle-orm';

import logger from '../config/logger';
import { CacheService } from '../controllers/cache-service';
import { db } from '../db';
import { CourseRepository } from '../db/course.repository';
import { ModuleRepository } from '../db/module.repository';
import { modules } from '../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { CreateModuleDto, UpdateModuleDto } from '../types';

export class ModuleService {
  public static async addModuleToCourse(
    data: CreateModuleDto,
    requesterId: string
  ) {
    logger.info(`Adding module "${data.title}" to course ${data.courseId}`);

    const course = await CourseRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundError('Course');
    }
    if (course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const nextOrder = await ModuleRepository.countByCourseId(data.courseId);

    const newModule = await ModuleRepository.create({
      ...data,
      order: nextOrder,
    });

    await CacheService.del(`course:details:${data.courseId}`);

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
    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) {
      throw new NotFoundError('Module');
    }
    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    const updatedModule = await ModuleRepository.update(moduleId, data);

    await CacheService.del(`course:details:${parentModule.courseId}`);

    return updatedModule;
  }

  public static async deleteModule(moduleId: string, requesterId: string) {
    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) {
      throw new NotFoundError('Module');
    }
    if (parentModule.course.instructorId !== requesterId) {
      throw new ForbiddenError();
    }

    await ModuleRepository.delete(moduleId);

    await CacheService.del(`course:details:${parentModule.courseId}`);

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
      const ownerId = allModules[0].course.instructorId;

      const allModulesFromSameCourse = allModules.every(
        (m) => m.courseId === parentCourseId
      );
      if (!allModulesFromSameCourse || ownerId !== requesterId) {
        throw new ForbiddenError();
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
      await CacheService.del(`course:details:${parentCourseId}`);
    });
  }
}

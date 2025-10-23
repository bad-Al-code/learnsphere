import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../errors';
import {
  addModuleToCourseSchema,
  bulkModulesSchema,
  moduleIdParamSchema,
  updateModuleSchema,
} from '../schemas';
import { ModuleService } from '../services';

export class ModuleController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = addModuleToCourseSchema.parse({
        params: req.params,
      }).params;
      const moduleData = addModuleToCourseSchema.parse({ body: req.body }).body;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      const module = await ModuleService.addModuleToCourse(
        { ...moduleData, courseId },
        requester
      );

      res.status(StatusCodes.CREATED).json(module);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { moduleId } = moduleIdParamSchema.parse({
        params: req.params,
      }).params;

      const moduleDetails = await ModuleService.getModuleDetails(moduleId);

      res.status(StatusCodes.OK).json(moduleDetails);
    } catch (error) {
      next(error);
    }
  }

  public static async getBulk(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { moduleIds } = bulkModulesSchema.parse({ body: req.body })['body'];
      if (!Array.isArray(moduleIds)) {
        throw new BadRequestError('moduleIds must be an array.');
      }

      const modules = await ModuleService.getModulesByIds(moduleIds);

      res.status(StatusCodes.OK).json(modules);
    } catch (error) {
      next(error);
    }
  }

  public static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { moduleId } = updateModuleSchema.parse({
        params: req.params,
      }).params;
      const updateData = updateModuleSchema.parse({ body: req.body }).body;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      const updatedModule = await ModuleService.updateModule(
        moduleId,
        updateData,
        requester
      );
      res.status(StatusCodes.OK).json(updatedModule);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { moduleId } = moduleIdParamSchema.parse({
        params: req.params,
      }).params;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      await ModuleService.deleteModule(moduleId, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Module deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async reorder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { moduleIds } = bulkModulesSchema.parse({ body: req.body }).body;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      await ModuleService.reorderModules(moduleIds, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Modules reordered successfully' });
    } catch (error) {
      next(error);
    }
  }
}

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotAuthorizedError } from '../errors';
import { ModuleService } from '../services';

export class ModuleController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const moduleData = req.body;
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
      const { moduleId } = req.params;
      const moduleDetails = await ModuleService.getModuleDetails(moduleId);
      res.status(StatusCodes.OK).json(moduleDetails);
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
      const { moduleId } = req.params;
      const updateData = req.body;
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
      const { moduleId } = req.params;
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
      const { ids } = req.body;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      await ModuleService.reorderModules(ids, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Modules reordered successfully' });
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
      const { moduleIds } = req.body;
      const modules = await ModuleService.getModulesByIds(moduleIds);
      res.status(StatusCodes.OK).json(modules);
    } catch (error) {
      next(error);
    }
  }
}

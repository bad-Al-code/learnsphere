import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResourceService } from '../services';

export class ResourceController {
  public static async getForCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser!;
      const resources = await ResourceService.getResourcesForCourse(
        courseId,
        requester
      );
      res.status(StatusCodes.OK).json(resources);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser!;
      const newResource = await ResourceService.createResource(
        courseId,
        req.body,
        requester
      );
      res.status(StatusCodes.CREATED).json(newResource);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { resourceId } = req.params;
      const requester = req.currentUser!;
      const updatedResource = await ResourceService.updateResource(
        resourceId,
        req.body,
        requester
      );
      res.status(StatusCodes.OK).json(updatedResource);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { resourceId } = req.params;
      const requester = req.currentUser!;
      await ResourceService.deleteResource(resourceId, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Resource deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
}

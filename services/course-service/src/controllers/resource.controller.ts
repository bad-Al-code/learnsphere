import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  courseIdParamSchema,
  getResourcesForCourseSchema,
  getUploadUrlSchema,
  resourceIdParamSchema,
} from '../schemas';
import { ResourceService } from '../services';

export class ResourceController {
  public static async getForCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = getResourcesForCourseSchema.parse({
        params: req.params,
      }).params;
      const requester = req.currentUser!;
      const { limit, page } = getResourcesForCourseSchema.parse({
        query: req.query,
      }).query;

      const resources = await ResourceService.getResourcesForCourse(
        courseId,
        requester,
        page,
        limit
      );

      res.status(StatusCodes.OK).json(resources);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = courseIdParamSchema.parse({
        params: req.params,
      }).params;
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
      const { resourceId } = resourceIdParamSchema.parse({
        params: req.params,
      }).params;
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
      const { resourceId } = resourceIdParamSchema.parse({
        params: req.params,
      }).params;
      const requester = req.currentUser!;
      await ResourceService.deleteResource(resourceId, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Resource deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async getUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = getUploadUrlSchema.parse({
        params: req.params,
      }).params;
      const { filename } = getUploadUrlSchema.parse({ body: req.body }).body;
      const requester = req.currentUser!;

      const uploadData = await ResourceService.getUploadUrl(
        courseId,
        filename,
        requester
      );

      res.status(StatusCodes.OK).json(uploadData);
    } catch (error) {
      next(error);
    }
  }

  public static async downloadResource(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { resourceId } = resourceIdParamSchema.parse({
        params: req.params,
      }).params;
      const requester = req.currentUser!;

      const resource = await ResourceService.getResourceForDownload(
        resourceId,
        requester
      );

      res
        .status(StatusCodes.OK)
        .json({ message: 'Download event tracked.', url: resource.fileUrl });
    } catch (error) {
      next(error);
    }
  }
}

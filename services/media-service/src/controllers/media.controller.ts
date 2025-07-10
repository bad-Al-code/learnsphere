import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { MediaService } from '../services/media.service';
import { BadRequestError } from '../errors';

export class MediaController {
  public static async getUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filename, uploadType, metadata } = req.body;

      if (!metadata || typeof metadata !== 'object') {
        throw new BadRequestError('Metadata object is required.');
      }

      const result = await MediaService.getUploadUrl({
        uploadType,
        filename,
        metadata,
      });

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../errors';
import { requestUploadUrlSchema } from '../schemas/media-schema';
import { MediaService } from '../services/media.service';

export class MediaController {
  public static async getUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filename, uploadType, metadata } = requestUploadUrlSchema.parse({
        body: req.body,
      }).body;

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

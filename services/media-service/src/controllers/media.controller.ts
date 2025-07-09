import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { MediaService } from "../services/media.service";

export class MediaController {
  public static async getUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filename, uploadType, metadata } = req.body;

      const result = await MediaService.getPresignedUploadUrl({
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

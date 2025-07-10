import { Request, Response, Router } from 'express';
import { validateRequest } from '../middlewares/validate-request';
import { requestUploadUrlSchema } from '../schemas/media-schema';
import { MediaController } from '../controllers/media.controller';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.post(
  '/request-upload-url',
  validateRequest(requestUploadUrlSchema),
  async (req: Request, res: Response) => {
    const { filename, uploadType, metadata } = req.body;

    const result = await MediaController.getUploadUrl({
      uploadType,
      filename,
      metadata,
    });

    res.status(StatusCodes.OK).json(result);
  }
);

export { router as mediaRouter };

import { Request, Response, Router } from "express";
import { validateRequest } from "../middlewares/validate-request";
import { getUploadUrlSchema } from "../schemas/media-schema";
import { MediaService, UploadUrlParams } from "../services/media-service";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post(
  "/upload-url",
  validateRequest(getUploadUrlSchema),
  async (req: Request, res: Response) => {
    const uploadUrlParams: UploadUrlParams = req.body;
    const result = await MediaService.getUploadUrl(uploadUrlParams);

    res.status(StatusCodes.OK).json(result);
  }
);

export { router as mediaRouter };

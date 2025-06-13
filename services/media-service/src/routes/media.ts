import { Request, Response, Router } from "express";
import { validateRequest } from "../middlewares/validate-request";
import { getUploadUrlSchema } from "../schemas/media-schema";
import { MediaService } from "../services/media-service";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post(
  "/upload-url",
  validateRequest(getUploadUrlSchema),
  async (req: Request, res: Response) => {
    const { filename, userId } = req.body;
    const result = await MediaService.getUploadUrl(userId, filename);

    res.status(StatusCodes.OK).json(result);
  }
);

export { router as mediaRouter };

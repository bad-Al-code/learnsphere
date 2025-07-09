import { Router } from "express";

import { validateRequest } from "../middlewares/validate-request";
import { requestUploadUrlSchema } from "../schemas/media-schema";
import { MediaController } from "../controllers/media.controller";

const router = Router();

router.post(
  "/request-upload-url",
  validateRequest(requestUploadUrlSchema),
  MediaController.getUploadUrl
);

export { router as mediaRouter };

import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { ProfileService } from "../services/profile-service";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "../middlewares/validate-request";
import {
  avatarUploadUrlSchema,
  updateProfileSchema,
} from "../schemas/profile-schema";
import { NotFoundError } from "../errors";
import { z } from "zod";
import logger from "../config/logger";
import axios from "axios";

const router = Router();

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const profile = await ProfileService.getProfileById(userId);

  if (!profile) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ errors: [{ message: "Profile not found" }] });

    return;
  }

  res.status(StatusCodes.OK).json(profile);
});

router.put(
  "/me",
  requireAuth,
  validateRequest(updateProfileSchema),
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const updateData = req.body;

    const updatedProfile = await ProfileService.updateProfile(
      userId,
      updateData
    );
    if (!updatedProfile) {
      throw new NotFoundError("Profile");
    }

    res.status(StatusCodes.OK).json(updatedProfile);
  }
);

router.post(
  "/me/avatar-upload-url",
  requireAuth,
  validateRequest(avatarUploadUrlSchema),
  async (req: Request, res: Response) => {
    const { filename } = req.body;

    const userId = req.currentUser!.id;
    const mediaServiceUrl =
      process.env.MEDIA_SERVICE_URL || "http://localhost:8002";

    try {
      logger.info(
        `Requesting upload URL from media-service for user: ${userId}`
      );

      const response = await axios.post(
        `${mediaServiceUrl}/api/media/upload-url`,
        { filename, userId }
      );

      res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
      logger.error(`ERror contracting media-service`, { error });

      throw new Error(`Could not create upload URL.`);
    }
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const profile = await ProfileService.getPublicProfileById(id);

  res.status(StatusCodes.OK).json(profile);
});

export { router as profileRouter };

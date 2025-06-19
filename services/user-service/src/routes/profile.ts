import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { ProfileService } from "../services/profile-service";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "../middlewares/validate-request";
import {
  avatarUploadUrlSchema,
  bulkUsersSchema,
  searchProfileSchema,
  updateProfileSchema,
} from "../schemas/profile-schema";
import { NotFoundError } from "../errors";
import { TypeOf, z } from "zod";
import logger from "../config/logger";
import axios, { AxiosError } from "axios";
import { requireRole } from "../middlewares/require-role";

const router = Router();

router.post(
  "/bulk",
  validateRequest(bulkUsersSchema),
  async (req: Request, res: Response) => {
    const { userIds } = req.body;
    const users = await ProfileService.getPublicProfilesByIds(userIds);

    res.status(StatusCodes.OK).json(users);
  }
);

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const profile = await ProfileService.getPrivateProfileById(userId);

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

router.put(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  validateRequest(updateProfileSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProfile = await ProfileService.updateProfile(id, updateData);

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
        `${mediaServiceUrl}/api/media/request-upload-url`,
        { filename, uploadType: "avatar", metadata: { userId: userId } }
      );

      res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
      logger.error(`ERror contracting media-service for avatar upload URL`, {
        error: error instanceof AxiosError ? error.response?.data : error,
      });

      throw new Error(`Could not create upload URL.`);
    }
  }
);

router.get(
  "/search",
  validateRequest(searchProfileSchema),
  async (req: Request, res: Response) => {
    const { q, page, limit } = req.query as unknown as z.infer<
      typeof searchProfileSchema
    >["query"];

    const searchResult = await ProfileService.searchProfiles(q, page, limit);

    res.status(StatusCodes.OK).json(searchResult);
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const requester = req.currentUser;

  if (requester && requester.role === "admin") {
    const profile = await ProfileService.getPrivateProfileById(id);

    res.status(StatusCodes.OK).json(profile);
  }

  const profile = await ProfileService.getPublicProfileById(id);

  res.status(StatusCodes.OK).json(profile);
});

export { router as profileRouter };

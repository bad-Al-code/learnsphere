import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import {
  avatarUploadUrlSchema,
  bulkUsersSchema,
  searchProfileSchema,
  updateProfileSchema,
} from "../schemas/profile-schema";
import { ProfileController } from "../controllers/profile.controller";

const router = Router();

router.get("/me", requireAuth, ProfileController.getMyProfile);
router.put(
  "/me",
  requireAuth,
  validateRequest(updateProfileSchema),
  ProfileController.updateMyProfile
);
router.post(
  "/me/avatar-upload-url",
  requireAuth,
  validateRequest(avatarUploadUrlSchema),
  ProfileController.getAvatarUploadUrl
);

router.get(
  "/search",
  validateRequest(searchProfileSchema),
  ProfileController.searchProfiles
);
router.post(
  "/bulk",
  validateRequest(bulkUsersSchema),
  ProfileController.getBulkProfiles
);
router.get("/:id", ProfileController.getProfileById);

router.put(
  "/:id",
  requireAuth,
  requireRole(["admin"]),
  validateRequest(updateProfileSchema),
  ProfileController.updateUserProfileById
);

export { router as profileRouter };

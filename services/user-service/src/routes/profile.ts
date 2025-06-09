import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { ProfileService } from "../services/profile-service";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "../middlewares/validate-request";
import { updateProfileSchema } from "../schemas/profile-schema";
import { NotFoundError } from "../errors";

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

export { router as profileRouter };

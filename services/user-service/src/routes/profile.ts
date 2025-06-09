import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { ProfileService } from "../services/profile-service";
import { StatusCodes } from "http-status-codes";

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

export { router as profileRouter };

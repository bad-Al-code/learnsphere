import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "Media service is up and running" });
});

export { router as healthRouter };

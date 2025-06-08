import { Request, Response, Router } from "express";
import { validateRequest } from "../middlewares/validate-request";
import { signupSchema } from "../schemas/auth-schema";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  (req: Request, res: Response) => {
    const { email, password } = req.body;

    // TODO: logic

    res.status(StatusCodes.CREATED).json({
      message: "Signup successful",
      user: { email },
    });
  }
);

export { router as authRouter };

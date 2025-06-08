import { Request, Response, Router } from "express";

import { validateRequest } from "../middlewares/validate-request";
import { loginSchema, signupSchema } from "../schemas/auth-schema";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user-service";
import { sendTokenResponse } from "../utils/token";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.singup(email, password);
    // TODO: publish a user.registered event to rabbitmq

    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user,
    });
  }
);

router.post(
  "/login",
  validateRequest(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.login(email, password);

    sendTokenResponse(res, { id: user.id!, email: user.email }, StatusCodes.OK);
  }
);

export { router as authRouter };

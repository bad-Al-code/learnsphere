import { Request, Response, Router } from "express";

import { validateRequest } from "../middlewares/validate-request";
import { loginSchema, signupSchema } from "../schemas/auth-schema";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user-service";
import { sendTokenResponse } from "../utils/token";
import { UserRegisteredPublisher } from "../events/publisher";
import logger from "../config/logger";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.singup(email, password);

    try {
      const publisher = new UserRegisteredPublisher();
      await publisher.publish({ id: user.id!, email: user.email });
    } catch (error) {
      logger.error("Failed tp publish user.registered event", {
        userId: user.id,
        error,
      });
    }

    sendTokenResponse(
      res,
      { id: user.id!, email: user.email },
      StatusCodes.CREATED
    );
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

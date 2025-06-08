import { Request, Response, Router } from "express";

import { validateRequest } from "../middlewares/validate-request";
import { signupSchema } from "../schemas/auth-schema";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user-service";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.singup(email, password);

    // TODO: generate a JWT
    // TODO: publish a user.registered event to rabbitmq

    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user,
    });
  }
);

export { router as authRouter };

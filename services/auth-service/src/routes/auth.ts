import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { loginSchema, signupSchema } from "../schemas/auth-schema";
import { UserService } from "../services/user-service";
import {
  UserRegisteredPublisher,
  UserVerificationRequiredPublisher,
} from "../events/publisher";
import logger from "../config/logger";
import { UnauthenticatedError } from "../errors";
import { attachCookiesToResponse, sendTokenResponse } from "../utils/token";
import { BlacklistService } from "../services/blacklist-service";

const router = Router();

router.post(
  "/signup",
  validateRequest(signupSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, verificationToken } = await UserService.singup(
      email,
      password
    );

    try {
      const registeredPublisher = new UserRegisteredPublisher();
      await registeredPublisher.publish({ id: user.id!, email: user.email });

      const verificationPublisher = new UserVerificationRequiredPublisher();
      await verificationPublisher.publish({
        email: user.email,
        verificationToken,
      });
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

router.post("/refresh", (req: Request, res: Response) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthenticatedError("Authentication invalid: No refresh token");
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string; email: string };

    const userPayload = { id: payload.id, email: payload.email };
    attachCookiesToResponse(res, userPayload, {
      accessToken: true,
      refreshToken: true,
    });

    res.status(StatusCodes.OK).json({
      message: "Token refreshed",
      user: userPayload,
    });
  } catch (error) {
    throw new UnauthenticatedError(
      "Authentication Invalid: Refresh Token is invalid"
    );
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  try {
    const accessToken = req.signedCookies.token;
    if (accessToken) {
      const decoded = jwt.decode(accessToken) as { jti: string; exp: number };

      if (decoded && decoded.exp && decoded.jti) {
        BlacklistService.addToBlacklist(decoded.jti, decoded.exp);
      }
    }
  } catch (error) {
    logger.warn("Could not decode access token on logout for blacklisting.", {
      error,
    });
  }

  res.status(StatusCodes.OK).json({ message: "User logged out successfully" });
});

export { router as authRouter };

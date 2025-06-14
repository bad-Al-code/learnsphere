import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from "../schemas/auth-schema";
import { UserService } from "../services/user-service";
import {
  UserPasswordResetRequiredPublisher,
  UserRegisteredPublisher,
  UserVerificationRequiredPublisher,
} from "../events/publisher";
import logger from "../config/logger";
import { UnauthenticatedError } from "../errors";
import { BlacklistService } from "../services/blacklist-service";
import { requireAuth } from "../middlewares/require-auth";
import { attachCookiesToResponse, sendTokenResponse } from "../utils/token";
import { apiLimiter } from "../middlewares/rate-limiter";
import { requireRole } from "../middlewares/require-role";

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
      { id: user.id!, email: user.email, role: user.role },
      StatusCodes.CREATED
    );
  }
);

router.post(
  "/login",
  apiLimiter,
  validateRequest(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.login(email, password);

    sendTokenResponse(
      res,
      { id: user.id!, email: user.email, role: user.role },
      StatusCodes.OK
    );
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
    ) as {
      id: string;
      email: string;
      role: "student" | "instructor" | "admin";
    };

    const userPayload = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
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

router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  async (req: Request, res: Response) => {
    const { email, token } = req.body;

    await UserService.verifyEmail(email, token);

    res
      .status(StatusCodes.OK)
      .json({ message: "Email verification successfully." });
  }
);

router.post(
  "/forgot-password",
  apiLimiter,
  validateRequest(forgotPasswordSchema),
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await UserService.forgotPassword(email);

    if (result) {
      const publisher = new UserPasswordResetRequiredPublisher();
      await publisher.publish({ email, resetToken: result.resetToken });
    }

    res.status(StatusCodes.OK).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  }
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  async (req: Request, res: Response) => {
    const { email, token, password } = req.body;

    await UserService.resetPassword(email, token, password);
    res
      .status(StatusCodes.OK)
      .json({ message: "Password has been reset successfully." });
  }
);

router.get("/test-auth", requireAuth, requireRole(["admin"]), (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "Welcome, Admin! You have accessed a protected admin route.",
    user: req.currentUser?.dbUser,
    tokenInfo: req.currentUser?.tokenPayload,
  });
});

router.post(
  "/resend-verification",
  apiLimiter,
  validateRequest(resendVerificationSchema),
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await UserService.resendVerificationEmail(email);

    if (result) {
      const publisher = new UserVerificationRequiredPublisher();
      await publisher.publish({
        email: result.user.email,
        verificationToken: result.verificationToken,
      });
    }

    res.status(StatusCodes.OK).json({
      message:
        "If your email registed and unverified, a new verification link has been sent.",
    });
  }
);

export { router as authRouter };

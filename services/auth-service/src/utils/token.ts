import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import logger from "../config/logger";
import { AttachCookiesOptions, UserPayload } from "../types/auth.types";

export const attachCookiesToResponse = (
  res: Response,
  user: UserPayload,
  options: AttachCookiesOptions
) => {
  if (options.accessToken) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        jti: uuidv4(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    const accessTokenCookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
      // secure: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      signed: true,
      sameSite: "lax" as const,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    };

    res.cookie("token", accessToken, accessTokenCookieOptions);
  }

  if (options.refreshToken) {
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: process.env
          .JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      }
    );

    const oneDay = 24 * 60 * 60 * 1000;

    const refreshTokenCookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay * 7),
      // secure: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      signed: true,
      sameSite: "lax" as const,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    };

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  }
};

export const sendTokenResponse = (
  res: Response,
  user: UserPayload,
  statusCode: number
) => {
  logger.info(
    `Attaching access and refresh tokens for user id ${user.id}  to a secure cookie`
  );

  attachCookiesToResponse(res, user, { accessToken: true, refreshToken: true });

  res.status(statusCode).json({
    message: "Success",
    user: { id: user.id, email: user.email, role: user.role },
  });
};

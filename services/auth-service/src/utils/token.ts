import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

interface UserPayload {
  id: string;
  email: string;
}

const attachCookiesToResponse = (res: Response, user: UserPayload) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env
        .JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );

  const oneDay = 24 * 60 * 60 * 1000;

  const accessTokenCookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 15 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  };

  const refreshTokenCookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay * 7),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  };

  res.cookie("token", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
};

export const sendTokenResponse = (
  res: Response,
  user: UserPayload,
  statusCode: number
) => {
  logger.info(
    `Attaching access and refresh tokens for user id ${user.id}  to a secure cookie`
  );

  attachCookiesToResponse(res, user);

  res
    .status(statusCode)
    .json({ message: "Success", user: { id: user.id, email: user.email } });
};

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

interface UserPayload {
  id: string;
  email: string;
}

export const sendTokenResponse = (
  res: Response,
  user: UserPayload,
  statusCode: number
) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
    secure: process.env.NODE_ENV === "production",
    signed: true,
  };

  logger.info(`Attempting JWT for user id ${user.id}  to a secure cookie`);

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({ message: "Success", user: { id: user.id, email: user.email } });
};

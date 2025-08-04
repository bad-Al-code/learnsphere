import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import logger from '../config/logger';
import { AttachCookiesOptions, UserPayload } from '../types/auth.types';

export const attachCookiesToResponse = (
  res: Response,
  user: UserPayload,
  options: AttachCookiesOptions
): { jti: string | null } => {
  let jti: string | null = null;

  if (options.accessToken) {
    jti = uuidv4();
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        jti,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    const oneDay = 24 * 60 * 60 * 1000;

    const accessTokenCookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay * 1),
      // secure: process.env.NODE_ENV === "production",
      secure: env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'lax' as const,
      path: '/',
      domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
    };

    res.cookie('token', accessToken, accessTokenCookieOptions);
  }

  if (options.refreshToken) {
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_REFRESH_SECRET!,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      }
    );

    const oneDay = 24 * 60 * 60 * 1000;

    const refreshTokenCookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay * 7),
      // secure: process.env.NODE_ENV === "production",
      secure: env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'lax' as const,
      path: '/',
      domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
    };

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
  }

  return { jti };
};

export const sendTokenResponse = (
  res: Response,
  user: UserPayload,
  statusCode: number,
  options: { send: boolean } = { send: true }
): { jti: string | null } => {
  logger.info(
    `Attaching access and refresh tokens for user id ${user.id}  to a secure cookie`
  );

  const { jti } = attachCookiesToResponse(res, user, {
    accessToken: true,
    refreshToken: true,
  });

  if (options.send) {
    res.status(statusCode).json({
      message: 'Success',
      user: { id: user.id, email: user.email, role: user.role },
    });
  }
  return { jti };
};

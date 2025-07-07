import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { AuthService } from '../services/auth.service';
import { BlacklistService } from './blacklist-service';
import {
  UserPasswordResetRequiredPublisher,
  UserRegisteredPublisher,
  UserVerificationRequiredPublisher,
} from '../events/publisher';
import { attachCookiesToResponse, sendTokenResponse } from '../utils/token';
import logger from '../config/logger';
import { UnauthenticatedError } from '../errors';
import { UserPayload } from '../types/auth.types';
import { env } from '../config/env';

export class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, verificationToken } = await AuthService.signup(
        email,
        password
      );

      const registeredPublisher = new UserRegisteredPublisher();
      await registeredPublisher.publish({
        id: user.id!,
        email: user.email,
      });

      const verificationPublisher = new UserVerificationRequiredPublisher();
      await verificationPublisher.publish({
        email: user.email,
        verificationToken,
      });

      sendTokenResponse(
        res,
        { id: user.id!, email: user.email, role: user.role },
        StatusCodes.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.login(email, password);
      sendTokenResponse(
        res,
        { id: user.id!, email: user.email, role: user.role },
        StatusCodes.OK
      );
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, _next: NextFunction) {
    try {
      const accessToken = req.signedCookies.token;
      if (accessToken) {
        const decoded = jwt.decode(accessToken) as {
          jti: string;
          exp: number;
        };
        if (decoded?.jti && decoded?.exp) {
          BlacklistService.addToBlacklist(decoded.jti, decoded.exp);
        }
      }

      res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });

      res.status(StatusCodes.OK).json({
        message: 'User logged out successfully',
      });
    } catch (error) {
      logger.warn(
        'An error occurred during logout, but sending success response anyway.',
        { error }
      );

      res.status(StatusCodes.OK).json({
        message: 'User logged out successfully',
      });
    }
  }

  public static refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.signedCookies.refreshToken;

      if (!refreshToken) {
        throw new UnauthenticatedError(
          'Authentication invalid: No refresh token'
        );
      }

      const payload = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET!
      ) as UserPayload;

      const userPayload: UserPayload = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };

      attachCookiesToResponse(res, userPayload, {
        accessToken: true,
        refreshToken: true,
      });

      res.status(StatusCodes.OK).json({
        message: 'Token refreshed',
        user: userPayload,
      });
    } catch (_error) {
      next(
        new UnauthenticatedError(
          'Authentication Invalid: Refresh Token is invalid or expired'
        )
      );
    }
  }

  public static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, token } = req.body;
      await AuthService.verifyEmail(email, token);
      res.status(StatusCodes.OK).json({
        message: 'Email verification successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);

      if (result) {
        const publisher = new UserPasswordResetRequiredPublisher();
        await publisher.publish({
          email,
          resetToken: result.resetToken,
        });
      }

      res.status(StatusCodes.OK).json({
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, token, password } = req.body;
      await AuthService.resetPassword(email, token, password);
      res.status(StatusCodes.OK).json({
        message: 'Password has been reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendVerificationEmail(email);

      if (result) {
        const publisher = new UserVerificationRequiredPublisher();
        await publisher.publish({
          email: result.user.email,
          verificationToken: result.verificationToken,
        });
      }

      res.status(StatusCodes.OK).json({
        message:
          'If your email is registered and unverified, a new verification link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static testAuth(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(StatusCodes.OK).json({
        message: 'Welcome, Admin! You have accessed a protected admin route.',
        user: req.currentUser?.dbUser,
        tokenInfo: req.currentUser?.tokenPayload,
      });
    } catch (error) {
      next(error);
    }
  }
}

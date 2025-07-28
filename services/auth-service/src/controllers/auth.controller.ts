import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import logger from '../config/logger';
import passport from '../config/passport';
import { User } from '../db/database.types';
import { UnauthenticatedError } from '../errors';
import {
  UserPasswordResetRequiredPublisher,
  UserRegisteredPublisher,
  UserVerificationRequiredPublisher,
} from '../events/publisher';
import { AuditService } from '../services/audit.service';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { UserPayload } from '../types/auth.types';
import { RequestContext } from '../types/service.types';
import { attachCookiesToResponse, sendTokenResponse } from '../utils/token';
import { BlacklistService } from './blacklist-service';

export class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const { user, verificationCode, verificationToken } =
        await AuthService.signup(email, password, context);

      const registeredPublisher = new UserRegisteredPublisher();
      await registeredPublisher.publish({
        id: user.id!,
        email: user.email,
      });

      const verificationPublisher = new UserVerificationRequiredPublisher();
      await verificationPublisher.publish({
        email: user.email,
        verificationCode,
        verificationToken,
      });

      const { jti } = sendTokenResponse(
        res,
        { id: user.id!, email: user.email, role: user.role },
        StatusCodes.CREATED
      );

      if (jti) {
        await SessionService.createSession(jti, user.id, context);
      }
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const user = await AuthService.login(email, password, context);

      const { jti } = sendTokenResponse(
        res,
        { id: user.id!, email: user.email, role: user.role },
        StatusCodes.OK
      );

      if (jti) {
        await SessionService.createSession(jti, user.id, context);
      }
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, _next: NextFunction) {
    try {
      const userId = req.currentUser?.dbUser.id;
      if (userId) {
        AuditService.logEvent({
          action: 'LOGOUT',
          userId: userId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
      }

      const accessToken = req.signedCookies.token;
      if (accessToken) {
        const decoded = jwt.decode(accessToken) as {
          jti: string;
          exp: number;
        };
        if (decoded?.jti && decoded?.exp) {
          await BlacklistService.addToBlacklist(decoded.jti, decoded.exp);
          await SessionService.terminateSession(decoded.jti);
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
      const { email, code, token } = req.body;
      const codeOrToken = code || token;
      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      await AuthService.verifyEmail(email, codeOrToken, context);
      res.status(StatusCodes.OK).json({
        message: 'Email verified successfully.',
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
      const { email, code, password } = req.body;
      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.forgotPassword(email, context);

      if (result) {
        const publisher = new UserPasswordResetRequiredPublisher();
        await publisher.publish({
          email,
          resetCode: result.resetCode,
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

  public static async verifyResetCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, code } = req.body;
      const singleUseToken = await AuthService.verifyPasswordResetCode(
        email,
        code
      );

      res.status(StatusCodes.OK).json({ token: singleUseToken });
    } catch (error) {
      next(error);
    }
  }

  public static async verifyResetToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, token } = req.body;
      const singleUseToken = await AuthService.verifyPasswordResetToken(
        email,
        token
      );
      res.status(StatusCodes.OK).json({ token: singleUseToken });
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
      const { token, password } = req.body;
      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const user = await AuthService.resetPassword(token, password, context);

      sendTokenResponse(
        res,
        { id: user.id!, email: user.email, role: user.role },
        StatusCodes.OK
      );
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
      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.resendVerificationEmail(email, context);

      if (result) {
        const publisher = new UserVerificationRequiredPublisher();
        await publisher.publish({
          email: result.user.email,
          verificationCode: result.verificationCode,
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

  public static async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.currentUser?.dbUser.id;
      if (!userId) {
        throw new UnauthenticatedError('Authentication required');
      }

      const context: RequestContext = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      await AuthService.updatePassword(
        userId,
        currentPassword,
        newPassword,
        context
      );

      res
        .status(StatusCodes.OK)
        .json({ message: 'Password updated successfvully' });
    } catch (error) {
      next(error);
    }
  }

  public static async getSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.dbUser.id;
      const sessions = await SessionService.getUserSessions(userId);
      res.status(StatusCodes.OK).json({ sessions });
    } catch (error) {
      next(error);
    }
  }

  public static async terminateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sessionId } = req.params;
      await SessionService.terminateSession(sessionId);
      await BlacklistService.addToBlacklist(sessionId, 0);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Session terminated successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  });

  public static googleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    passport.authenticate(
      'google',
      { session: false },
      (err: Error, user: User, _info: object) => {
        if (err || !user) {
          res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'Google authentication failed.' });
          return;
        }

        const context: RequestContext = {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        };

        const { jti } = sendTokenResponse(
          res,
          { id: user.id, email: user.email, role: user.role },
          StatusCodes.OK
        );

        if (jti) {
          AuditService.logEvent({
            action: 'LOGIN_SUCCESS',
            userId: user.id,
            ...context,
            details: { provider: 'google' },
          });
          SessionService.createSession(jti, user.id, context);
        }
      }
    )(req, res, next);
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

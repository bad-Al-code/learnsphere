import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import logger from '../config/logger';
import { BadRequestError } from '../errors';
import {
  checkEmailSchema,
  updateInterestsSchema,
  waitlistSchema,
} from '../schemas/waitlist.schema';
import { WaitlistService } from '../services/waitlist.service';

export class WaitlistController {
  /**
   * Handles the request to join the waitlist.
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async join(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.correlationId;
    logger.info(`[${correlationId}] Received request to join waitlist.`);

    try {
      const { body } = waitlistSchema.parse({ body: req.body });
      const { email, referredByCode, role } = body;

      const newEntry = await WaitlistService.addToWaitlist(
        email,
        role,
        referredByCode
      );

      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, private'
      );
      res.setHeader('Pragma', 'no-cache');

      logger.info(
        `[${correlationId}] Successfully processed waitlist join request for email: ${email}`
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          id: newEntry.id,
          email: newEntry.email,
          createdAt: newEntry.createdAt,
        },
        message: 'Successfully added to waitlist',
      });
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(
          `[${correlationId}] Validation error on waitlist join request.`
        );

        return next(new BadRequestError(error.errors));
      }

      next(error);
    }
  }

  /**
   * Checks if an email exists in the waitlist.
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async checkEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const correlationId = req.correlationId;
    logger.info(`[${correlationId}] Received request for waitlist status.`);

    try {
      const { email } = checkEmailSchema.parse({ query: req.query }).query;

      logger.info(`Checking if email exists in waitlist: ${email}`);

      const waitlistEntry = await WaitlistService.getByEmail(email);
      if (!waitlistEntry) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: `No waitlist entry found for email: ${email}`,
        });

        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          waitlistPosition: waitlistEntry.waitlistPosition,
          referralCount: waitlistEntry.referralCount,
          referralCode: waitlistEntry.referralCode,
          rewardsUnlocked: waitlistEntry.rewardsUnlocked,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets waitlist statistics.
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      logger.info('Fetching waitlist statistics');

      const total = await WaitlistService.getCount();

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets all waitlist entries with pagination (Admin only - add auth middleware).
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;

      logger.info('Fetching all waitlist entries', { limit, offset });

      const { entries, total } = await WaitlistService.getAllEntries(
        limit,
        offset
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          entries,
          total,
          limit,
          offset,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes an email from the waitlist (Admin only - add auth middleware).
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Email parameter is required',
        });
      }

      logger.info(`Removing email from waitlist: ${email}`);

      const deleted = await WaitlistService.removeFromWaitlist(email);

      if (!deleted) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Email not found in waitlist',
        });
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Successfully removed from waitlist',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to update a user's interests on the waitlist.
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async updateInterests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const correlationId = req.correlationId;
    logger.info(
      `[${correlationId}] Received request to update waitlist interests.`
    );

    try {
      const { email, interests } = updateInterestsSchema.parse({
        body: req.body,
      }).body;

      await WaitlistService.updateInterests(email, interests);

      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');

      logger.info(
        `[${correlationId}] Successfully processed interest update for email: ${email}`
      );
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Interests updated successfully.' });
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(
          `[${correlationId}] Validation error on update interests request.`
        );

        return next(new BadRequestError(error.errors));
      }

      next(error);
    }
  }
}

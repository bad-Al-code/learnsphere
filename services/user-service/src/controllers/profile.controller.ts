import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { ProfileService } from '../services/profile.service';
import logger from '../config/logger';
import axios, { AxiosError } from 'axios';
import { searchProfileSchema } from '../schemas/profile-schema';
import { NotAuthorizedError } from '../errors';
import { env } from '../config/env';

export class ProfileController {
  public static async getMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser?.id;
      if (!userId) {
        throw new NotAuthorizedError();
      }
      const profile = await ProfileService.getPrivateProfileById(userId);
      res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      next(error);
    }
  }

  public static async updateMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;
      const updatedProfile = await ProfileService.updateProfile(
        userId,
        req.body
      );
      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  public static async getProfileById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const requester = req.currentUser;

      if (requester?.role === 'admin') {
        const profile = await ProfileService.getPrivateProfileById(id);
        res.status(StatusCodes.OK).json(profile);
        return;
      }

      const profile = await ProfileService.getPublicProfileById(id);
      res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      next(error);
    }
  }

  public static async updateUserProfileById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const updatedProfile = await ProfileService.updateProfile(id, req.body);
      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  public static async getBulkProfiles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userIds } = req.body;
      const users = await ProfileService.getPublicProfilesByIds(userIds);
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      next(error);
    }
  }

  public static async searchProfiles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { q, page, limit } = req.query as unknown as z.infer<
        typeof searchProfileSchema
      >['query'];
      const searchResult = await ProfileService.searchProfiles(q, page, limit);
      res.status(StatusCodes.OK).json(searchResult);
    } catch (error) {
      next(error);
    }
  }

  public static async getAvatarUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filename } = req.body;
      const userId = req.currentUser!.id;

      const mediaServiceUrl = env.MEDIA_SERVICE_URL || 'http://localhost:8002';

      logger.info(
        `Requesting upload URL from media-service for user: ${userId}`
      );
      const response = await axios.post(
        `${mediaServiceUrl}/api/media/request-upload-url`,
        { filename, uploadType: 'avatar', metadata: { userId: userId } }
      );

      res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
      logger.error(`Error contacting media-service for avatar upload URL`, {
        error: error instanceof AxiosError ? error.response?.data : error,
      });
      next(new Error(`Could not create upload URL.`));
    }
  }

  public static async getMySettings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;

      const settings = await ProfileService.getSettings(userId);

      res.status(StatusCodes.OK).json(settings);
    } catch (error) {
      next(error);
    }
  }

  public static async updateMySettings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;

      const updatedSettings = await ProfileService.updateSettings(
        userId,
        req.body
      );

      res.status(StatusCodes.OK).json(updatedSettings);
    } catch (error) {
      next(error);
    }
  }

  public static async applyForInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;

      await ProfileService.applyForInstructor(userId);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Your application has been submitted for review.' });
    } catch (error) {
      next(error);
    }
  }

  public static async approveInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const updatedProfile = await ProfileService.approveInstructor(id);
      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  public static async suspendUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      await ProfileService.suspendUser(id);

      res
        .status(StatusCodes.OK)
        .json({ message: 'User has been suspended successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async addFcmToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;
      const { token } = req.body;

      await ProfileService.addFcmToken(userId, token);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Token registerd successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async removeFcmToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;
      const { token } = req.body;

      await ProfileService.removeFcmToken(userId, token);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Token removed successfully.' });
    } catch (error) {
      next(error);
    }
  }
}

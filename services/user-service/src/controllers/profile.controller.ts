import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import axios, { AxiosError } from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';
import { NotAuthorizedError } from '../errors';
import {
  applyForInstructorSchema,
  avatarUploadUrlSchema,
  bulkUsersSchema,
  fcmTokenSchema,
  getProfileByEmailSchema,
  searchProfileSchema,
  userIdParamSchema,
  userSearchQuerySchema,
} from '../schemas';
import { ProfileService } from '../services/profile.service';

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

      const responsePayload = { ...profile, role: req.currentUser?.role };

      res.status(StatusCodes.OK).json(responsePayload);
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
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;
      const requester = req.currentUser;

      if (requester?.role === 'admin') {
        const profile = await ProfileService.getPrivateProfileById(userId);
        res.status(StatusCodes.OK).json(profile);
        return;
      }

      const profile = await ProfileService.getPublicProfileById(userId);
      res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      next(error);
    }
  }

  public static async getProfileIdByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = getProfileByEmailSchema.parse({
        params: req.params,
      }).params;

      const profile = await ProfileService.getProfileIdByEmail(email);

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
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;

      const updatedProfile = await ProfileService.updateProfile(
        userId,
        req.body
      );

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
      const { userIds } = bulkUsersSchema.parse({ body: req.body }).body;

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
      const { q, page, limit, status } = searchProfileSchema.parse({
        query: req.query,
      }).query;

      const searchQuery = q ? String(q) : '';
      const pageNumber = page ? parseInt(String(page), 10) : 1;
      const limitNumber = limit ? parseInt(String(limit), 10) : 10;
      const statusFilter = status ? String(status) : undefined;

      const searchResult = await ProfileService.searchProfiles(
        searchQuery,
        pageNumber,
        limitNumber,
        statusFilter
      );

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
      const { filename } = avatarUploadUrlSchema.parse({ body: req.body }).body;
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
      const applicationData = applyForInstructorSchema.parse({
        body: req.body,
      }).body;

      await ProfileService.applyForInstructor(userId, applicationData);

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
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;

      const updatedProfile = await ProfileService.approveInstructor(userId);

      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  public static async declineInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;

      await ProfileService.declineInstructor(userId);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Instructor application has been declined.' });
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
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;

      await ProfileService.suspendUser(userId);

      res
        .status(StatusCodes.OK)
        .json({ message: 'User has been suspended successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async reinstateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;

      await ProfileService.reinstateUser(userId);
      res
        .status(StatusCodes.OK)
        .json({ message: 'User has been reinstated successfully.' });
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
      const { token } = fcmTokenSchema.parse({ body: req.body }).body;

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
      const { token } = fcmTokenSchema.parse({ body: req.body }).body;

      await ProfileService.removeFcmToken(userId, token);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Token removed successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async getFcmTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = userIdParamSchema.parse({ params: req.params }).params;

      const profile = await ProfileService.getPrivateProfileById(userId);

      res.status(StatusCodes.OK).json({ fcmTokens: profile.fcmTokens });
    } catch (error) {
      next(error);
    }
  }

  public static async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const stats = await ProfileService.getPlatformStats();

      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public static async patchMySettings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;

      const updateSettings = await ProfileService.updateSettings(
        userId,
        req.body
      );

      res.status(StatusCodes.OK).json(updateSettings);
    } catch (error) {
      next(error);
    }
  }

  public static async searchUsersQuery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { q, limit } = userSearchQuerySchema.parse({
        query: req.query,
      }).query;

      const users = await ProfileService.searchUsers(
        q as string,
        Number(limit)
      );

      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      next(error);
    }
  }
}

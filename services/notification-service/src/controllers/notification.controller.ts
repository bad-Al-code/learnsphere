import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { NotificationService } from '../services/notification.service';
import { StatusCodes } from 'http-status-codes';

export class NotificationController {
  public static async getMyNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const userId = req.currentUser.id;
      const notifications = await NotificationService.getNotification(userId);

      res.status(StatusCodes.OK).json(notifications);
    } catch (error) {
      next(error);
    }
  }

  public static async markAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const userId = req.currentUser.id;
      const { notificationId } = req.params;

      const updatedNotification =
        await NotificationService.markNotificationAsRead(
          notificationId,
          userId
        );

      res.status(StatusCodes.OK).json(updatedNotification);
    } catch (error) {
      next(error);
    }
  }
}

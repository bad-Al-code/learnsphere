import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EmailClient } from '../clients/email.client';
import { UserRepository } from '../db/user.respository';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { EmailService } from '../services/email-service';
import { NotificationService } from '../services/notification.service';

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
      const notifications =
        await NotificationService.getNotificationsForUser(userId);

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

  public static async markAllAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const userId = req.currentUser.id;

      await NotificationService.markAllNotificationsAsRead(userId);

      res
        .status(StatusCodes.OK)
        .json({ message: 'All notifications marked as read.' });
    } catch (error) {
      next(error);
    }
  }

  public static async sendEmailInvites(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { emails, subject, message, linkUrl } = req.body;

      const user = await UserRepository.findById(req.currentUser.id);
      const inviterName = user?.name || 'A fellow student';

      const emailService = new EmailService(new EmailClient());
      await emailService.sendBatchInvites(
        emails,
        subject,
        message,
        linkUrl,
        inviterName
      );

      res
        .status(StatusCodes.OK)
        .json({ message: `Invitations sent to ${emails.length} recipients.` });
    } catch (error) {
      next(error);
    }
  }

  public static async sendBulkEmailInvites(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { contacts, subject, message, linkUrl } = req.body;

      const user = await UserRepository.findById(req.currentUser.id);
      const inviterName = user?.name || 'A fellow student';

      const emailService = new EmailService(new EmailClient());
      await emailService.sendBulkInvites(
        contacts,
        subject,
        message,
        linkUrl,
        inviterName
      );
      res
        .status(StatusCodes.OK)
        .json({
          message: `Invitations sent to ${contacts.length} recipients.`,
        });
    } catch (error) {
      next(error);
    }
  }
}

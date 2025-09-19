import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../../errors';
import { IntegrationService } from './integration.service';

export class IntegrationController {
  public static async getIntegrations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const integrations = await IntegrationService.getIntegrationsForUser(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(integrations);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteIntegration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      await IntegrationService.deleteIntegration(id, req.currentUser.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  public static async connectGoogleCalendar(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const authUrl = IntegrationService.generateGoogleCalendarAuthUrl(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json({ redirectUrl: authUrl });
    } catch (error) {
      next(error);
    }
  }

  public static async connectGoogleDrive(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const authUrl = IntegrationService.generateGoogleDriveAuthUrl(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json({ redirectUrl: authUrl });
    } catch (error) {
      next(error);
    }
  }

  public static async connectGmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const authUrl = IntegrationService.generateGmailAuthUrl(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json({ redirectUrl: authUrl });
    } catch (error) {
      next(error);
    }
  }

  public static async handleGoogleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code, state } = req.query as { code: string; state: string };
      if (!code || !state) {
        throw new BadRequestError('Missing code or state in callback.');
      }

      await IntegrationService.handleGoogleOAuthCallback(code, state);

      res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/integrations?status=success`
      );
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/integrations?status=error`
      );
    }
  }

  public static async connectNotion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const authUrl = IntegrationService.generateNotionAuthUrl(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json({ redirectUrl: authUrl });
    } catch (error) {
      next(error);
    }
  }

  public static async handleNotionCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code, state } = req.query as { code: string; state: string };
      if (!code || !state) {
        throw new BadRequestError('Missing code or state in Notion callback.');
      }

      await IntegrationService.handleNotionOAuthCallback(code, state);

      res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/integrations?status=success`
      );
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/integrations?status=error&provider=notion`
      );
    }
  }

  public static async exportCourseToNotion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId } = req.body;

      const result = await IntegrationService.exportCourseToNotion(
        req.currentUser.id,
        courseId
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

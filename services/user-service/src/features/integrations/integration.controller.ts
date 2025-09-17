import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../../errors';
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
}

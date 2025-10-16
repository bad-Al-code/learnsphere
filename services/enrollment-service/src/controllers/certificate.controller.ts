import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { getCertificatesQuerySchema } from '../schema';
import { CertificateService } from '../services';

export class CertificateController {
  /**
   * Controller to get the current user's certificates.
   */
  public static async getMyCertificates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const query = getCertificatesQuerySchema.parse({
        query: req.query,
      }).query;

      const certificates = await CertificateService.getCertificates(
        req.currentUser.id,
        query
      );

      res.status(StatusCodes.OK).json(certificates);
    } catch (error) {
      next(error);
    }
  }
}

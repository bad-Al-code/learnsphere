import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import {
  bulkActionSchema,
  certificateParamsSchema,
  getCertificatesQuerySchema,
  updateNotesSchema,
} from '../schema';
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

  /**
   * Controller to toggle the favorite status of a certificate.
   */
  public static async toggleFavorite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const { enrollmentId } = certificateParamsSchema.parse({
        params: req.params,
      }).params;

      const updated = await CertificateService.toggleFavorite(
        enrollmentId,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Controller to toggle the archive status of a certificate.
   */
  public static async toggleArchive(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const { enrollmentId } = certificateParamsSchema.parse({
        params: req.params,
      }).params;

      const updated = await CertificateService.toggleArchive(
        enrollmentId,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Controller to update the notes for a certificate.
   */
  public static async updateNotes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const { enrollmentId } = certificateParamsSchema.parse({
        params: req.params,
      }).params;
      const { notes } = updateNotesSchema.parse({ body: req.body }).body;

      const updated = await CertificateService.updateNotes(
        enrollmentId,
        notes,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Controller to soft-delete a certificate.
   */
  public static async deleteCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const { enrollmentId } = certificateParamsSchema.parse({
        params: req.params,
      }).params;

      await CertificateService.deleteCertificate(enrollmentId, req.currentUser);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Controller to bulk archive certificates.
   */
  public static async bulkArchive(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { enrollmentIds } = bulkActionSchema.parse({ body: req.body }).body;

      await CertificateService.bulkArchive(enrollmentIds, req.currentUser);

      res.status(StatusCodes.OK).json({ message: 'Certificates archived.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Controller to bulk delete certificates.
   */
  public static async bulkDelete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { enrollmentIds } = bulkActionSchema.parse({ body: req.body }).body;

      await CertificateService.bulkDelete(enrollmentIds, req.currentUser);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

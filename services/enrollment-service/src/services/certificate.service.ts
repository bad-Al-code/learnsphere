import logger from '../config/logger';
import { CertificateRepository, EnrollRepository } from '../db/repositories';
import { ForbiddenError, NotFoundError } from '../errors';
import { GetCertificatesQuery } from '../schema';
import { Enrollment, Requester } from '../types';

export class CertificateService {
  /**
   * Retrieves a student's certificates, enriched with course information.
   * @param studentId The ID of the student.
   * @param options The query options for filtering and pagination.
   * @returns A paginated result of the student's certificates.
   */
  public static async getCertificates(
    studentId: string,
    options: GetCertificatesQuery
  ) {
    logger.info(`Fetching certificates for student ${studentId}`, { options });

    try {
      const { totalResults, results } = await CertificateRepository.findForUser(
        studentId,
        options
      );

      const enrichedResults = results.map((cert) => ({
        id: cert.id,
        title: cert.courseTitle,
        issuer: 'LearnSphere', // Placeholder
        issueDate: cert.issueDate.toISOString(),
        expiryDate: null, // Placeholder
        tags: cert.tags,
        credentialId: cert.certificateId,
        imageUrl: cert.certificateUrl,
        description: `Certificate of completion for the course "${cert.courseTitle}".`, // Placeholder
        verificationUrl: `/verify/${cert.certificateId}`, // Placeholder
        isFavorite: cert.isFavorite,
        isArchived: cert.isArchived,
        notes: cert.notes,
      }));

      return {
        results: enrichedResults,
        pagination: {
          currentPage: options.page,
          totalPages: Math.ceil(totalResults / options.limit),
          totalResults,
        },
      };
    } catch (error) {
      logger.error(`Failed to get certificates for student ${studentId}: %o`, {
        error,
      });

      throw new Error('An error occurred while fetching certificates.');
    }
  }

  /**
   * Toggles the favorite status of a certificate after verifying ownership.
   * @param enrollmentId The ID of the enrollment/certificate.
   * @param requester The user making the request.
   * @returns The updated enrollment object.
   */
  public static async toggleFavorite(
    enrollmentId: string,
    requester: Requester
  ): Promise<Enrollment> {
    logger.info(
      `User ${requester.id} attempting to toggle favorite for enrollment ${enrollmentId}`
    );

    const enrollment = await EnrollRepository.findById(enrollmentId);
    if (!enrollment)
      throw new NotFoundError('Certificate (enrollment) not found.');

    if (enrollment.userId !== requester.id) {
      logger.warn(
        `Forbidden attempt by user ${requester.id} to modify enrollment ${enrollmentId}`
      );

      throw new ForbiddenError();
    }

    const updatedEnrollment =
      await CertificateRepository.toggleFavorite(enrollmentId);

    logger.info(
      `Successfully toggled favorite status for enrollment ${enrollmentId} to ${updatedEnrollment.isFavorite}`
    );

    return updatedEnrollment;
  }

  /**
   * Toggles the archive status of a certificate after verifying ownership.
   * @param enrollmentId The ID of the enrollment/certificate.
   * @param requester The user making the request.
   * @returns The updated enrollment object.
   */
  public static async toggleArchive(
    enrollmentId: string,
    requester: Requester
  ): Promise<Enrollment> {
    logger.info(
      `User ${requester.id} attempting to toggle archive for enrollment ${enrollmentId}`
    );

    const enrollment = await EnrollRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Certificate (enrollment) not found.');
    }

    if (enrollment.userId !== requester.id) {
      logger.warn(
        `Forbidden attempt by user ${requester.id} to modify enrollment ${enrollmentId}`
      );

      throw new ForbiddenError();
    }

    const updatedEnrollment =
      await CertificateRepository.toggleArchive(enrollmentId);

    logger.info(
      `Successfully toggled archive status for enrollment ${enrollmentId} to ${updatedEnrollment.isArchived}`
    );

    return updatedEnrollment;
  }

  /**
   * Updates the notes for a certificate after verifying ownership.
   * @param enrollmentId The ID of the enrollment/certificate.
   * @param notes The new notes to save.
   * @param requester The user making the request.
   * @returns The updated enrollment object.
   */
  public static async updateNotes(
    enrollmentId: string,
    notes: string,
    requester: Requester
  ): Promise<Enrollment> {
    logger.info(
      `User ${requester.id} attempting to update notes for enrollment ${enrollmentId}`
    );

    const enrollment = await EnrollRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Certificate (enrollment) not found.');
    }

    if (enrollment.userId !== requester.id) {
      logger.warn(
        `Forbidden attempt by user ${requester.id} to update notes for enrollment ${enrollmentId}`
      );
      throw new ForbiddenError();
    }

    const updatedEnrollment = await CertificateRepository.updateNotes(
      enrollmentId,
      notes
    );

    logger.info(`Successfully updated notes for enrollment ${enrollmentId}.`);

    return updatedEnrollment;
  }

  /**
   * Soft deletes a certificate after verifying ownership.
   * @param enrollmentId The ID of the enrollment/certificate to delete.
   * @param requester The user making the request.
   */
  public static async deleteCertificate(
    enrollmentId: string,
    requester: Requester
  ): Promise<void> {
    logger.info(
      `User ${requester.id} attempting to delete enrollment ${enrollmentId}`
    );

    const enrollment = await EnrollRepository.findById(enrollmentId);
    if (!enrollment) {
      logger.warn(
        `Attempted to delete non-existent enrollment ${enrollmentId}`
      );
      return;
    }

    if (enrollment.userId !== requester.id) {
      logger.warn(
        `Forbidden attempt by user ${requester.id} to delete enrollment ${enrollmentId}`
      );
      throw new ForbiddenError();
    }

    await CertificateRepository.softDelete(enrollmentId);

    logger.info(
      `Successfully soft-deleted enrollment ${enrollmentId} for user ${requester.id}`
    );
  }

  /**
   * Verifies that the requester owns all specified enrollments.
   * @param enrollmentIds An array of enrollment IDs.
   * @param requester The user making the request.
   * @throws {ForbiddenError} if the user does not own all enrollments.
   */
  private static async verifyBulkOwnership(
    enrollmentIds: string[],
    requester: Requester
  ) {
    if (enrollmentIds.length === 0) return;

    const enrollments = await CertificateRepository.findByIds(enrollmentIds);
    if (enrollments.length !== enrollmentIds.length) {
      throw new NotFoundError('One or more certificates not found.');
    }

    const isOwnerOfAll = enrollments.every((e) => e.userId === requester.id);

    if (!isOwnerOfAll) {
      throw new ForbiddenError();
    }
  }

  /**
   * Archives multiple certificates in a single bulk operation.
   * @param enrollmentIds The IDs of the certificates/enrollments to archive.
   * @param requester The user making the request.
   */
  public static async bulkArchive(
    enrollmentIds: string[],
    requester: Requester
  ): Promise<void> {
    logger.info(
      `User ${requester.id} attempting to bulk archive ${enrollmentIds.length} certificates.`
    );

    await this.verifyBulkOwnership(enrollmentIds, requester);
    await CertificateRepository.bulkArchive(enrollmentIds);

    logger.info(
      `Successfully bulk archived ${enrollmentIds.length} certificates for user ${requester.id}.`
    );
  }

  /**
   * Soft-deletes multiple certificates in a single bulk operation.
   * @param enrollmentIds The IDs of the certificates/enrollments to delete.
   * @param requester The user making the request.
   */
  public static async bulkDelete(
    enrollmentIds: string[],
    requester: Requester
  ): Promise<void> {
    logger.info(
      `User ${requester.id} attempting to bulk delete ${enrollmentIds.length} certificates.`
    );

    await this.verifyBulkOwnership(enrollmentIds, requester);
    await CertificateRepository.bulkSoftDelete(enrollmentIds);

    logger.info(
      `Successfully bulk soft-deleted ${enrollmentIds.length} certificates for user ${requester.id}.`
    );
  }
}

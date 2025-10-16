import logger from '../config/logger';
import { CertificateRepository } from '../db/repositories';
import { GetCertificatesQuery } from '../schema';

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
}

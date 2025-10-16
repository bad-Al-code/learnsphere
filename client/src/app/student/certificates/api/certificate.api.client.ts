import { enrollmentService } from '@/lib/api/client';
import { Certificate } from 'crypto';
import {
  CertificateFilters,
  GetCertificatesResponse,
} from '../schemas/certificate.schema';

/**
 * Fetches the current user's certificates with optional filters such as search query, tag, or sort order.
 * @param  filters - The filters and pagination options for fetching certificates.
 * @param  filters.page - The current page number.
 * @param  filters.limit - The number of certificates per page.
 * @param  filters.sortBy - The field to sort results by.
 * @param  filters.q - Optional search query.
 * @param  filters.tag - Optional tag to filter certificates.
 * @param  filters.filter - Optional filter value (e.g., "favorites" or "archived").
 * @returns  A promise that resolves to the list of user certificates.
 */
export const getMyCertificates = async (
  filters: CertificateFilters
): Promise<GetCertificatesResponse> => {
  try {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      sortBy: filters.sortBy,
    });
    if (filters.q) params.append('q', filters.q);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.filter) params.append('filter', filters.filter);

    const response = await enrollmentService.getTyped<GetCertificatesResponse>(
      `/api/enrollments/my-certificates?${params.toString()}`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch certificates:', error);

    throw new Error('Could not load your certificates.');
  }
};

/**
 * Toggles the favorite status of a certificate.
 * @param enrollmentId The ID of the enrollment/certificate.
 * @returns A promise that resolves to the updated certificate data.
 */
export const toggleFavorite = async (
  enrollmentId: string
): Promise<Certificate> => {
  try {
    const response = await enrollmentService.patchTyped<Certificate>(
      `/api/enrollments/my-certificates/${enrollmentId}/toggle-favorite`,
      {}
    );

    return response;
  } catch (error) {
    console.error('Failed to toggle favorite status:', error);
    throw new Error('Could not update favorite status.');
  }
};

/**
 * Toggles the archive status of a certificate.
 * @param enrollmentId The ID of the enrollment/certificate.
 * @returns A promise that resolves to the updated certificate data.
 */
export const toggleArchive = async (
  enrollmentId: string
): Promise<Certificate> => {
  try {
    const response = await enrollmentService.patchTyped<Certificate>(
      `/api/enrollments/my-certificates/${enrollmentId}/toggle-archive`,
      {}
    );

    return response;
  } catch (error) {
    console.error('Failed to toggle archive status:', error);
    throw new Error('Could not update archive status.');
  }
};

/**
 * Updates the notes for a certificate.
 * @param enrollmentId The ID of the enrollment/certificate.
 * @param notes The new text for the notes.
 * @returns A promise that resolves to the updated certificate data.
 */
export const updateNotes = async (
  enrollmentId: string,
  notes: string
): Promise<Certificate> => {
  try {
    const response = await enrollmentService.putTyped<Certificate>(
      `/api/enrollments/my-certificates/${enrollmentId}/notes`,
      { notes }
    );

    return response;
  } catch (error) {
    console.error('Failed to update notes:', error);
    throw new Error('Could not save your notes.');
  }
};

/**
 * Deletes a certificate (soft delete).
 * @param enrollmentId The ID of the enrollment/certificate.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteCertificate = async (
  enrollmentId: string
): Promise<void> => {
  try {
    await enrollmentService.deleteTyped(
      `/api/enrollments/my-certificates/${enrollmentId}`
    );
  } catch (error) {
    console.error('Failed to delete certificate:', error);
    throw new Error('Could not delete the certificate.');
  }
};

/**
 * Archives multiple certificates in a single request.
 * @param enrollmentIds An array of enrollment/certificate IDs.
 */
export const bulkArchiveCertificates = async (
  enrollmentIds: string[]
): Promise<{ message: string }> => {
  try {
    const response = await enrollmentService.postTyped<{ message: string }>(
      `/api/enrollments/my-certificates/bulk-archive`,
      { enrollmentIds }
    );

    return response;
  } catch (error) {
    console.error('Failed to bulk archive certificates:', error);
    throw new Error('Could not archive the selected certificates.');
  }
};

/**
 * Deletes multiple certificates in a single request (soft delete).
 * @param enrollmentIds An array of enrollment/certificate IDs.
 */
export const bulkDeleteCertificates = async (
  enrollmentIds: string[]
): Promise<void> => {
  try {
    await enrollmentService.postTyped(
      `/api/enrollments/my-certificates/bulk-delete`,
      { enrollmentIds }
    );
  } catch (error) {
    console.error('Failed to bulk delete certificates:', error);
    throw new Error('Could not delete the selected certificates.');
  }
};

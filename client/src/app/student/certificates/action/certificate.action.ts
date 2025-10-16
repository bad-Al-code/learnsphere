import {
  bulkArchiveCertificates,
  bulkDeleteCertificates,
  deleteCertificate,
  getMyCertificates,
  toggleArchive,
  toggleFavorite,
  updateNotes,
} from '../api/certificate.api.client';
import { CertificateFilters } from '../schemas/certificate.schema';

export const getMyCertificatesAction = async (filters: CertificateFilters) => {
  try {
    const data = await getMyCertificates(filters);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const toggleFavoriteAction = async (enrollmentId: string) => {
  try {
    const data = await toggleFavorite(enrollmentId);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const toggleArchiveAction = async (enrollmentId: string) => {
  try {
    const data = await toggleArchive(enrollmentId);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const updateNotesAction = async (
  enrollmentId: string,
  notes: string
) => {
  try {
    const data = await updateNotes(enrollmentId, notes);

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const deleteCertificateAction = async (enrollmentId: string) => {
  try {
    await deleteCertificate(enrollmentId);

    return { data: { success: true } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const bulkArchiveAction = async (enrollmentIds: string[]) => {
  try {
    const data = await bulkArchiveCertificates(enrollmentIds);

    console.log(data);
    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export const bulkDeleteAction = async (enrollmentIds: string[]) => {
  try {
    await bulkDeleteCertificates(enrollmentIds);

    return { data: { success: true } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

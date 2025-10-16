import { enrollmentService } from '@/lib/api/client';
import {
  CertificateFilters,
  GetCertificatesResponse,
} from '../schemas/certificate.schema';

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

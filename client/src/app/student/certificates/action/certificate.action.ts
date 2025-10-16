import { getMyCertificates } from '../api/certificate.api.client';
import { CertificateFilters } from '../schemas/certificate.schema';

export const getMyCertificatesAction = async (filters: CertificateFilters) => {
  try {
    const data = await getMyCertificates(filters);

    console.log(data);
    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

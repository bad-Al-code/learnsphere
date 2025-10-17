'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  bulkArchiveAction,
  bulkDeleteAction,
  deleteCertificateAction,
  getMyCertificatesAction,
  toggleArchiveAction,
  toggleFavoriteAction,
  updateNotesAction,
} from '../action/certificate.action';
import type {
  Certificate,
  GetCertificatesResponse,
} from '../schemas/certificate.schema';
import { useCertificatesStore } from '../store/certificate.store';

const CERTIFICATES_QUERY_KEY = 'certificates';

export const useCertificates = () => {
  const {
    searchQuery,
    selectedTag,
    sortOption,
    showFavoritesOnly,
    showArchivedOnly,
    page,
    limit,
  } = useCertificatesStore();

  return useQuery({
    queryKey: [
      CERTIFICATES_QUERY_KEY,
      {
        q: searchQuery,
        tag: selectedTag,
        sortBy: sortOption,
        filter: showFavoritesOnly
          ? 'favorites'
          : showArchivedOnly
            ? 'archived'
            : undefined,
        page,
        limit,
      },
    ],
    queryFn: async () => {
      const result = await getMyCertificatesAction({
        q: searchQuery,
        tag: selectedTag || undefined,
        sortBy: sortOption,
        filter: showFavoritesOnly
          ? 'favorites'
          : showArchivedOnly
            ? 'archived'
            : undefined,
        page,
        limit,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data!;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
    retry: 2,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      const result = await toggleFavoriteAction(enrollmentId);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },

    onMutate: async (enrollmentId) => {
      await queryClient.cancelQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<GetCertificatesResponse>({
        queryKey: [CERTIFICATES_QUERY_KEY],
      });

      queryClient.setQueriesData<GetCertificatesResponse>(
        { queryKey: [CERTIFICATES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.map((cert) =>
              cert.id === enrollmentId
                ? { ...cert, isFavorite: !cert.isFavorite }
                : cert
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (err, variables, context) => {
      toast.error('Failed to update favorite status.');
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSuccess: () => {
      toast.success('Favorite status updated.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });
    },
  });
};

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      const result = await toggleArchiveAction(enrollmentId);
      if (result.error) throw new Error(result.error);
      return result.data! as Certificate;
    },

    onMutate: async (enrollmentId) => {
      await queryClient.cancelQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<GetCertificatesResponse>({
        queryKey: [CERTIFICATES_QUERY_KEY],
      });

      queryClient.setQueriesData<GetCertificatesResponse>(
        { queryKey: [CERTIFICATES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            results: oldData.results.filter((cert) => cert.id !== enrollmentId),
            pagination: {
              ...oldData.pagination,
              totalResults: Math.max(0, oldData.pagination.totalResults - 1),
            },
          };
        }
      );

      return { previousData };
    },

    onSuccess: (data: Certificate) => {
      toast.success(
        data.isArchived ? 'Certificate archived.' : 'Certificate unarchived.'
      );
    },

    onError: (err, variables, context) => {
      toast.error('Failed to update archive status.');
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });
    },
  });
};

export const useUpdateNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      enrollmentId,
      notes,
    }: {
      enrollmentId: string;
      notes: string;
    }) => {
      const result = await updateNotesAction(enrollmentId, notes);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },

    onMutate: async ({ enrollmentId, notes }) => {
      await queryClient.cancelQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<GetCertificatesResponse>({
        queryKey: [CERTIFICATES_QUERY_KEY],
      });

      queryClient.setQueriesData<GetCertificatesResponse>(
        { queryKey: [CERTIFICATES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.map((cert) =>
              cert.id === enrollmentId ? { ...cert, notes } : cert
            ),
          };
        }
      );

      return { previousData };
    },

    onSuccess: () => {
      toast.success('Notes saved successfully.');
    },

    onError: (err, variables, context) => {
      toast.error('Failed to save notes.');
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      const result = await deleteCertificateAction(enrollmentId);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },

    onMutate: async (enrollmentId) => {
      await queryClient.cancelQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<GetCertificatesResponse>({
        queryKey: [CERTIFICATES_QUERY_KEY],
      });

      queryClient.setQueriesData<GetCertificatesResponse>(
        { queryKey: [CERTIFICATES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.filter((cert) => cert.id !== enrollmentId),
            pagination: {
              ...oldData.pagination,
              totalResults: oldData.pagination.totalResults - 1,
            },
          };
        }
      );

      return { previousData };
    },

    onSuccess: () => {
      toast.success('Certificate deleted successfully.');
    },

    onError: (err, variables, context) => {
      toast.error('Failed to delete certificate.');
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });
    },
  });
};

export const useBulkArchive = () => {
  const queryClient = useQueryClient();
  const clearSelection = useCertificatesStore((state) => state.clearSelection);

  return useMutation({
    mutationFn: async (enrollmentIds: string[]) => {
      const result = await bulkArchiveAction(enrollmentIds);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },

    onMutate: async (enrollmentIds) => {
      await queryClient.cancelQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<GetCertificatesResponse>({
        queryKey: [CERTIFICATES_QUERY_KEY],
      });

      const idSet = new Set(enrollmentIds);

      queryClient.setQueriesData<GetCertificatesResponse>(
        { queryKey: [CERTIFICATES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            results: oldData.results.filter((cert) => !idSet.has(cert.id)),
            pagination: {
              ...oldData.pagination,
              totalResults:
                oldData.pagination.totalResults - enrollmentIds.length,
            },
          };
        }
      );

      return { previousData };
    },

    onSuccess: (data, variables) => {
      toast.success(`${variables.length} certificate(s) archived.`);
      clearSelection();
    },

    onError: (err, variables, context) => {
      toast.error('Failed to archive certificates.');
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });
    },
  });
};

export const useBulkDelete = () => {
  const queryClient = useQueryClient();
  const clearSelection = useCertificatesStore((state) => state.clearSelection);

  return useMutation({
    mutationFn: async (enrollmentIds: string[]) => {
      const result = await bulkDeleteAction(enrollmentIds);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },

    onMutate: async (enrollmentIds) => {
      await queryClient.cancelQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<GetCertificatesResponse>({
        queryKey: [CERTIFICATES_QUERY_KEY],
      });

      const idSet = new Set(enrollmentIds);

      queryClient.setQueriesData<GetCertificatesResponse>(
        { queryKey: [CERTIFICATES_QUERY_KEY] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            results: oldData.results.filter((cert) => !idSet.has(cert.id)),
            pagination: {
              ...oldData.pagination,
              totalResults:
                oldData.pagination.totalResults - enrollmentIds.length,
            },
          };
        }
      );

      return { previousData };
    },

    onSuccess: (data, variables) => {
      toast.success(`${variables.length} certificate(s) deleted.`);
      clearSelection();
    },

    onError: (err, variables, context) => {
      toast.error('Failed to delete certificates.');
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CERTIFICATES_QUERY_KEY] });
    },
  });
};

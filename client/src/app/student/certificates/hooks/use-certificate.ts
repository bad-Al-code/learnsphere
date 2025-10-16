'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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
import { GetCertificatesResponse } from '../schemas';
import { useCertificatesStore } from '../store/certificate.store';

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

  const queryResult = useQuery({
    queryKey: [
      'certificates',
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
    queryFn: () =>
      getMyCertificatesAction({
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
      }),
    placeholderData: (previousData) => previousData,

    retry: 1,
  });

  useEffect(() => {
    if (queryResult.data?.error) {
      throw new Error(queryResult.data.error);
    }
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: queryResult.data?.data,
  };
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => toggleFavoriteAction(enrollmentId),
    onMutate: async (enrollmentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });

      const previousData = queryClient.getQueryData<GetCertificatesResponse>([
        'certificates',
      ]);

      queryClient.setQueryData<GetCertificatesResponse>(
        ['certificates'],
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
      toast.error('Failed to update favorite.');

      if (context?.previousData) {
        queryClient.setQueryData(['certificates'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => toggleArchiveAction(enrollmentId),
    onMutate: async (enrollmentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });

      const previousData = queryClient.getQueryData<GetCertificatesResponse>([
        'certificates',
      ]);

      queryClient.setQueryData<GetCertificatesResponse>(
        ['certificates'],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.map((cert) =>
              cert.id === enrollmentId
                ? { ...cert, isArchived: !cert.isArchived, isFavorite: false }
                : cert
            ),
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
      toast.success('Certificate status updated.');
    },

    onError: (err, variables, context) => {
      toast.error('Failed to update archive status.');

      if (context?.previousData) {
        queryClient.setQueryData(['certificates'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useUpdateNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      notes,
    }: {
      enrollmentId: string;
      notes: string;
    }) => updateNotesAction(enrollmentId, notes),
    onMutate: async ({ enrollmentId, notes }) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });

      const previousData = queryClient.getQueryData<GetCertificatesResponse>([
        'certificates',
      ]);

      queryClient.setQueryData<GetCertificatesResponse>(
        ['certificates'],
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
        queryClient.setQueryData(['certificates'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => deleteCertificateAction(enrollmentId),

    onMutate: async (enrollmentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });

      const previousData = queryClient.getQueryData<GetCertificatesResponse>([
        'certificates',
      ]);

      queryClient.setQueryData<GetCertificatesResponse>(
        ['certificates'],
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
        queryClient.setQueryData(['certificates'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useBulkArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentIds: string[]) => bulkArchiveAction(enrollmentIds),

    onMutate: async (enrollmentIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });
      const previousData = queryClient.getQueryData<GetCertificatesResponse>([
        'certificates',
      ]);

      queryClient.setQueryData<GetCertificatesResponse>(
        ['certificates'],
        (oldData) => {
          if (!oldData) return oldData;

          const idSet = new Set(enrollmentIds);
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

    onSuccess: () => {
      toast.success('Certificates archived.');
    },

    onError: (err, ids, context) => {
      toast.error('Failed to archive certificates.');
      if (context?.previousData) {
        queryClient.setQueryData(['certificates'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useBulkDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentIds: string[]) => bulkDeleteAction(enrollmentIds),

    onMutate: async (enrollmentIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });
      const previousData = queryClient.getQueryData<GetCertificatesResponse>([
        'certificates',
      ]);

      queryClient.setQueryData<GetCertificatesResponse>(
        ['certificates'],
        (oldData) => {
          if (!oldData) return oldData;

          const idSet = new Set(enrollmentIds);
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

    onSuccess: () => {
      toast.success('Certificates deleted.');
    },

    onError: (err, ids, context) => {
      toast.error('Failed to delete certificates.');

      if (context?.previousData) {
        queryClient.setQueryData(['certificates'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMyCertificatesAction } from '../action/certificate.action';
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

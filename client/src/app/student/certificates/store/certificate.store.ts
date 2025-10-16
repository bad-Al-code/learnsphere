import { create } from 'zustand';

import { SortOption } from '../schemas';

type ViewMode = 'grid' | 'list';
type GridColumns = 2 | 3 | 4;

type CertificatesState = {
  searchQuery: string;
  selectedTag: string | null;
  sortOption: SortOption;
  viewMode: ViewMode;
  gridColumns: GridColumns;
  showFavoritesOnly: boolean;
  showArchivedOnly: boolean;
  page: number;
  limit: number;

  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setGridColumns: (cols: GridColumns) => void;
  toggleFavoritesOnly: () => void;
  toggleArchivedOnly: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useCertificatesStore = create<CertificatesState>((set) => ({
  searchQuery: '',
  selectedTag: null,
  sortOption: 'date-desc',
  viewMode: 'grid',
  gridColumns: 3,
  showFavoritesOnly: false,
  showArchivedOnly: false,
  page: 1,
  limit: 12,

  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setSelectedTag: (tag) => set({ selectedTag: tag, page: 1 }),
  setSortOption: (option) => set({ sortOption: option, page: 1 }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setGridColumns: (cols) => set({ gridColumns: cols }),
  toggleFavoritesOnly: () =>
    set((state) => ({
      showFavoritesOnly: !state.showFavoritesOnly,
      showArchivedOnly: false,
      page: 1,
    })),
  toggleArchivedOnly: () =>
    set((state) => ({
      showArchivedOnly: !state.showArchivedOnly,
      showFavoritesOnly: false,
      page: 1,
    })),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GridColumns,
  SortOption,
  ViewMode,
} from '../schemas/certificate.schema';

interface CertificatesState {
  searchQuery: string;
  selectedTag: string | null;
  sortOption: SortOption;
  viewMode: ViewMode;
  gridColumns: GridColumns;
  showFavoritesOnly: boolean;
  showArchivedOnly: boolean;
  page: number;
  limit: number;
  selectedIds: Set<string>;

  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setGridColumns: (cols: GridColumns) => void;
  toggleFavoritesOnly: () => void;
  toggleArchivedOnly: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  selectedTag: null,
  sortOption: 'date-desc' as SortOption,
  viewMode: 'grid' as ViewMode,
  gridColumns: 3 as GridColumns,
  showFavoritesOnly: false,
  showArchivedOnly: false,
  page: 1,
  limit: 12,
  selectedIds: new Set<string>(),
};

export const useCertificatesStore = create<CertificatesState>()(
  persist(
    (set) => ({
      ...initialState,

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
          selectedIds: new Set(),
        })),

      toggleArchivedOnly: () =>
        set((state) => ({
          showArchivedOnly: !state.showArchivedOnly,
          showFavoritesOnly: false,
          page: 1,
          selectedIds: new Set(),
        })),

      setPage: (page) => set({ page }),

      setLimit: (limit) => set({ limit, page: 1 }),

      toggleSelectId: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedIds);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedIds: newSet };
        }),

      selectAll: (ids) =>
        set((state) => {
          const allSelected = ids.every((id) => state.selectedIds.has(id));
          return {
            selectedIds: allSelected ? new Set() : new Set(ids),
          };
        }),

      clearSelection: () => set({ selectedIds: new Set() }),

      resetFilters: () =>
        set({
          searchQuery: '',
          selectedTag: null,
          sortOption: 'date-desc',
          showFavoritesOnly: false,
          showArchivedOnly: false,
          page: 1,
        }),
    }),
    {
      name: 'certificates-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        gridColumns: state.gridColumns,
        limit: state.limit,
        sortOption: state.sortOption,
      }),
    }
  )
);

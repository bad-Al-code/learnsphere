import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TFilter, TSortOption, TViewMode } from '../schemas/achievement.schema';

interface AchievementState {
  viewMode: TViewMode;
  sortBy: TSortOption;
  itemsPerPage: number;

  filters: TFilter;

  selectedAchievements: Set<string>;

  detailsModalOpen: boolean;
  selectedAchievementId: string | null;

  recentlyEarned: string[];

  setViewMode: (mode: TViewMode) => void;
  setSortBy: (sort: TSortOption) => void;
  setItemsPerPage: (items: number) => void;

  setFilters: (filters: Partial<TFilter>) => void;
  clearFilters: () => void;
  toggleStarredFilter: () => void;

  toggleSelectAchievement: (id: string) => void;
  selectMultipleAchievements: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: (achievementIds: string[]) => void;

  openDetailsModal: (achievementId: string) => void;
  closeDetailsModal: () => void;

  addRecentlyEarned: (achievementId: string) => void;
  clearRecentlyEarned: () => void;
  removeFromRecentlyEarned: (achievementId: string) => void;
}

const defaultFilters: TFilter = {
  search: '',
  status: undefined,
  category: undefined,
  difficulty: undefined,
  rarity: undefined,
  starred: undefined,
  showHidden: false,
};

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      viewMode: 'grid',
      sortBy: 'date_earned',
      itemsPerPage: 20,
      filters: defaultFilters,
      selectedAchievements: new Set(),
      detailsModalOpen: false,
      selectedAchievementId: null,
      recentlyEarned: [],

      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setItemsPerPage: (items) => set({ itemsPerPage: items }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      clearFilters: () => set({ filters: defaultFilters }),

      toggleStarredFilter: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            starred: state.filters.starred === true ? undefined : true,
          },
        })),

      toggleSelectAchievement: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedAchievements);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedAchievements: newSet };
        }),

      selectMultipleAchievements: (ids) =>
        set((state) => {
          const newSet = new Set(state.selectedAchievements);
          ids.forEach((id) => newSet.add(id));
          return { selectedAchievements: newSet };
        }),

      clearSelection: () => set({ selectedAchievements: new Set() }),

      selectAll: (achievementIds) =>
        set({ selectedAchievements: new Set(achievementIds) }),

      openDetailsModal: (achievementId) =>
        set({ detailsModalOpen: true, selectedAchievementId: achievementId }),

      closeDetailsModal: () =>
        set({ detailsModalOpen: false, selectedAchievementId: null }),

      addRecentlyEarned: (achievementId) =>
        set((state) => ({
          recentlyEarned: [achievementId, ...state.recentlyEarned].slice(0, 10),
        })),

      clearRecentlyEarned: () => set({ recentlyEarned: [] }),

      removeFromRecentlyEarned: (achievementId) =>
        set((state) => ({
          recentlyEarned: state.recentlyEarned.filter(
            (id) => id !== achievementId
          ),
        })),
    }),
    {
      name: 'achievement-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        itemsPerPage: state.itemsPerPage,
        filters: {
          starred: state.filters.starred,
          showHidden: state.filters.showHidden,
        },
      }),
    }
  )
);

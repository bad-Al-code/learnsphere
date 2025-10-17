import { create } from 'zustand';

export const SORT_OPTIONS = [
  'Recently Accessed',
  'Progress %',
  'Alphabetical',
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

type EnrolledCoursesState = {
  q: string;
  sortBy: SortOption;
  page: number;
  limit: number;
  setQuery: (q: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useEnrolledCoursesStore = create<EnrolledCoursesState>((set) => ({
  q: '',
  sortBy: 'Recently Accessed',
  filterBy: 'All Courses',
  page: 1,
  limit: 6,
  setQuery: (q) => set({ q, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
}));

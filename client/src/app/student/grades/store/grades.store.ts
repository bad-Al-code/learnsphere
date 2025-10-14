import { create } from 'zustand';

import { GradesFilters } from '../schema';

type GradesState = GradesFilters & {
  setQuery: (q: string) => void;
  setCourseId: (courseId: string) => void;
  setStatus: (status: 'Graded' | 'Pending' | undefined) => void;
  setGrade: (grade: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useGradesStore = create<GradesState>((set) => ({
  q: '',
  courseId: undefined,
  status: undefined,
  grade: undefined,
  page: 1,
  limit: 10,
  setQuery: (q) => set({ q, page: 1 }),
  setCourseId: (courseId) =>
    set({ courseId: courseId === 'all' ? undefined : courseId, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setGrade: (grade) =>
    set({ grade: grade === 'all' ? undefined : grade, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
}));

import { create } from 'zustand';

import {
  AIRecommendation,
  EnrichedPendingAssignment,
} from '../schemas/assignment.schema';

export type AssignmentStatusFilter = 'all' | 'not-started' | 'in-progress';
export type AssignmentTypeFilter = 'individual' | 'collaborative' | 'all';

type AssignmentState = {
  selectedAssignment: EnrichedPendingAssignment | null;
  selectedIds: Set<string>;
  isDrawerOpen: boolean;
  searchTerm: string;
  statusFilter: AssignmentStatusFilter;
  typeFilter: AssignmentTypeFilter;
  isScheduleModalOpen: boolean;
  schedulingRecommendation: AIRecommendation | null;
  actions: {
    viewAssignment: (assignment: EnrichedPendingAssignment) => void;
    closeDrawer: () => void;
    toggleSelection: (id: string) => void;
    clearSelection: () => void;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (status: AssignmentStatusFilter) => void;
    setTypeFilter: (status: AssignmentTypeFilter) => void;
    openScheduleModal: (recommendation: AIRecommendation) => void;
    closeScheduleModal: () => void;
  };
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  selectedAssignment: null,
  isDrawerOpen: false,
  selectedIds: new Set(),
  searchTerm: '',
  statusFilter: 'all',
  typeFilter: 'all',
  isScheduleModalOpen: false,
  schedulingRecommendation: null,
  actions: {
    viewAssignment: (assignment) =>
      set({ selectedAssignment: assignment, isDrawerOpen: true }),

    closeDrawer: () => set({ isDrawerOpen: false, selectedAssignment: null }),

    toggleSelection: (id) =>
      set((state) => {
        const newSelectedIds = new Set(state.selectedIds);
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }

        return { selectedIds: newSelectedIds };
      }),

    clearSelection: () => set({ selectedIds: new Set() }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    setTypeFilter: (type) => set({ typeFilter: type }),
    openScheduleModal: (recommendation) =>
      set({
        isScheduleModalOpen: true,
        schedulingRecommendation: recommendation,
      }),

    closeScheduleModal: () =>
      set({ isScheduleModalOpen: false, schedulingRecommendation: null }),
  },
}));

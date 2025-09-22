import { create } from 'zustand';

import { EnrichedPendingAssignment } from '../schemas/assignment.schema';

type AssignmentState = {
  selectedAssignment: EnrichedPendingAssignment | null;
  selectedIds: Set<string>;
  isDrawerOpen: boolean;
  actions: {
    viewAssignment: (assignment: EnrichedPendingAssignment) => void;
    closeDrawer: () => void;
    toggleSelection: (id: string) => void;
    clearSelection: () => void;
  };
};
export const useAssignmentStore = create<AssignmentState>((set) => ({
  selectedAssignment: null,
  selectedIds: new Set(),
  isDrawerOpen: false,
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
  },
}));

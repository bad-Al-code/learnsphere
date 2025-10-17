import { create } from 'zustand';
import type { CourseDetail } from '../schema/course-detail.schema';

interface CourseDetailState {
  courseDetail: CourseDetail | null;
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  setCourseDetail: (detail: CourseDetail) => void;
  setSelectedModuleId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
}

export const useCourseDetailStore = create<CourseDetailState>((set) => ({
  courseDetail: null,
  selectedModuleId: null,
  selectedLessonId: null,
  setCourseDetail: (detail) => set({ courseDetail: detail }),
  setSelectedModuleId: (id) => set({ selectedModuleId: id }),
  setSelectedLessonId: (id) => set({ selectedLessonId: id }),
}));

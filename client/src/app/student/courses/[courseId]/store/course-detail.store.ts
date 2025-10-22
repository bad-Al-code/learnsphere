import { create } from 'zustand';
import type { CourseDetail } from '../schema/course-detail.schema';

interface CourseDetailState {
  courseDetail: CourseDetail | null;
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  isAIChatOpen: boolean;
  isSidebarCollapsed: boolean;
  setCourseDetail: (detail: CourseDetail) => void;
  setSelectedModuleId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
  markLessonComplete: (lessonId: string) => void;
  toggleLessonBookmark: (lessonId: string) => void;
  toggleAIChat: () => void;
  toggleSidebar: () => void;
}

export const useCourseDetailStore = create<CourseDetailState>((set, get) => ({
  courseDetail: null,
  selectedModuleId: null,
  selectedLessonId: null,
  isAIChatOpen: false,
  isSidebarCollapsed: false,

  setCourseDetail: (detail) => set({ courseDetail: detail }),
  setSelectedModuleId: (id) => set({ selectedModuleId: id }),
  setSelectedLessonId: (id) => set({ selectedLessonId: id }),

  markLessonComplete: (lessonId) => {
    const { courseDetail } = get();
    if (!courseDetail) return;

    const updatedModules = courseDetail.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      ),
    }));

    const updatedCompletedCount = updatedModules
      .flatMap((m) => m.lessons)
      .filter((l) => l.completed).length;

    const updatedCourseDetail = {
      ...courseDetail,
      modules: updatedModules,
      completedLessons: updatedCompletedCount,
      progressPercentage:
        (updatedCompletedCount / courseDetail.totalLessons) * 100,
    };

    set({ courseDetail: updatedCourseDetail });
  },

  toggleLessonBookmark: (lessonId) => {
    const { courseDetail } = get();
    if (!courseDetail) return;

    const updatedModules = courseDetail.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, bookmarked: !lesson.bookmarked }
          : lesson
      ),
    }));

    set({ courseDetail: { ...courseDetail, modules: updatedModules } });
  },

  toggleAIChat: () =>
    set(
      (state): Partial<CourseDetailState> => ({
        isAIChatOpen: !state.isAIChatOpen,
      })
    ),

  toggleSidebar: () =>
    set(
      (state): Partial<CourseDetailState> => ({
        isSidebarCollapsed: !state.isSidebarCollapsed,
      })
    ),
}));

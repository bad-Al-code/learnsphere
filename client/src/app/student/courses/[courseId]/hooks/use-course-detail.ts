import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAssignmentForLesson,
  fetchCourseDetail,
  fetchQuizForLesson,
  fetchResourcesForLesson,
} from '../api/course-detail.api';
import type {
  Assignment,
  CourseDetail,
  Quiz,
  Resource,
} from '../schema/course-detail.schema';

export function useCourseDetail(courseId: string) {
  return useQuery<CourseDetail, Error>({
    queryKey: ['courseDetail', courseId],
    queryFn: () => fetchCourseDetail(courseId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useQuizForLesson(lessonId: string, enabled: boolean = true) {
  return useQuery<Quiz, Error>({
    queryKey: ['quiz', lessonId],
    queryFn: () => fetchQuizForLesson(lessonId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAssignmentForLesson(
  lessonId: string,
  enabled: boolean = true
) {
  return useQuery<Assignment, Error>({
    queryKey: ['assignment', lessonId],
    queryFn: () => fetchAssignmentForLesson(lessonId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useResourcesForLesson(
  lessonId: string,
  enabled: boolean = true
) {
  return useQuery<Resource[], Error>({
    queryKey: ['resources', lessonId],
    queryFn: () => fetchResourcesForLesson(lessonId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmitQuiz(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answers: Record<string, string>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const quiz = queryClient.getQueryData<Quiz>(['quiz', lessonId]);
      if (!quiz) throw new Error('Quiz not found');

      let correctCount = 0;
      quiz.questions.forEach((question) => {
        if (answers[question.id] === question.correctAnswer) {
          correctCount += question.points;
        }
      });

      const percentage = Math.round((correctCount / quiz.totalPoints) * 100);
      const passed = percentage >= quiz.passingScore;

      return {
        id: crypto.randomUUID(),
        score: correctCount,
        percentage,
        answers,
        completedAt: new Date().toISOString(),
        passed,
      };
    },
    onSuccess: (attempt) => {
      queryClient.setQueryData<Quiz>(['quiz', lessonId], (old) => {
        if (!old) return old;
        return {
          ...old,
          attempts: [...old.attempts, attempt],
        };
      });
    },
  });
}

export function useSubmitAssignment(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      content: string;
      attachments?: Array<{ name: string; url: string; size: number }>;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        content: data.content,
        attachments: data.attachments,
        feedback: undefined,
        score: undefined,
        maxScore: 100,
        gradedAt: undefined,
        status: 'pending' as const,
      };
    },
    onSuccess: (submission) => {
      queryClient.setQueryData<Assignment>(['assignment', lessonId], (old) => {
        if (!old) return old;
        return {
          ...old,
          submissions: [...old.submissions, submission],
        };
      });
    },
  });
}

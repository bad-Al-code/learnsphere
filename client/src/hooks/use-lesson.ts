'use client';

import { getLesson } from '@/lib/api/lesson';
import { useQuery } from '@tanstack/react-query';

export function useLesson(lessonId: string, initialData?: any) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLesson(lessonId),
    initialData: initialData,
  });
}

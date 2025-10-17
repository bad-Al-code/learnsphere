'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCourseDetail } from '../api/course-detail.api';
import type { CourseDetail } from '../schema/course-detail.schema';

export function useCourseDetail(courseId: string) {
  return useQuery<CourseDetail, Error>({
    queryKey: ['courseDetail', courseId],
    queryFn: () => fetchCourseDetail(courseId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

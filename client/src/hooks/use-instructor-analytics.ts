import {
  getEngagementDistribution,
  getEngagementScore,
  getGradeDistribution,
  getOverallStats,
  getPerformanceTrends,
  getStudentPerformanceOverview,
  getTotalRevenue,
} from '@/lib/api/analytics';
import { courseService, userService } from '@/lib/api/client';
import { getLetterGrade } from '@/lib/utils';
import { BulkCourse } from '@/types/course';
import { BulkUser } from '@/types/user';
import { useQueries, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo } from 'react';

export function useInstructorStats() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['instructor', 'overallStats'],
        queryFn: getOverallStats,
      },
      {
        queryKey: ['instructor', 'engagementScore'],
        queryFn: getEngagementScore,
      },
      {
        queryKey: ['instructor', 'totalRevenue'],
        queryFn: getTotalRevenue,
      },
    ],
  });

  const isLoading = results.some((query) => query.isLoading);

  const data = {
    avgGrade: results[0].data?.avgGrade,
    completionRate: results[0].data?.avgCompletion,
    engagementScore: results[1].data,
    totalRevenue: results[2].data?.totalRevenue,
  };

  return {
    data,
    isLoading,
  };
}

export function usePerformanceTrends() {
  return useQuery({
    queryKey: ['instructor', 'performanceTrends'],
    queryFn: getPerformanceTrends,
  });
}

export function useGradeDistribution() {
  return useQuery({
    queryKey: ['instructor', 'gradeDistribution'],
    queryFn: getGradeDistribution,
  });
}

export function useStudentPerformance() {
  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['instructor', 'studentPerformance'],
    queryFn: getStudentPerformanceOverview,
  });

  const studentIds = useMemo(
    () =>
      performanceData
        ? [
            ...new Set(
              [
                ...performanceData.topPerformers,
                ...performanceData.studentsAtRisk,
              ].map((s) => s.userId)
            ),
          ]
        : [],
    [performanceData]
  );

  const courseIds = useMemo(
    () =>
      performanceData
        ? [
            ...new Set(
              [
                ...performanceData.topPerformers,
                ...performanceData.studentsAtRisk,
              ].map((s) => s.courseId)
            ),
          ]
        : [],
    [performanceData]
  );

  const { data: userProfiles, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', 'bulk', studentIds],

    queryFn: async () => {
      if (studentIds.length === 0) {
        return [];
      }
      const response = await userService.post('/api/users/bulk', {
        userIds: studentIds,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profiles');
      }

      return (await response.json()) as BulkUser[];
    },

    enabled: studentIds.length > 0,
  });

  const { data: courseDetails, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses', 'bulk', courseIds],

    queryFn: async () => {
      if (courseIds.length === 0) {
        return [];
      }

      const response = await courseService.post('/api/courses/bulk', {
        courseIds,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      return (await response.json()) as BulkCourse[];
    },

    enabled: courseIds.length > 0,
  });

  const enrichedData = useMemo(() => {
    if (
      !performanceData ||
      !Array.isArray(userProfiles) ||
      !Array.isArray(courseDetails)
    ) {
      return null;
    }

    const userMap = new Map(userProfiles.map((u) => [u.userId, u]));
    const courseMap = new Map(courseDetails.map((c) => [c.id, c]));

    const mapStudent = (student: any) => {
      const user = userMap.get(student.userId);
      const course = courseMap.get(student.courseId);

      return {
        name: user
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
          : 'Unknown Student',
        progress: parseFloat(student.progressPercentage),
        grade: getLetterGrade(
          student.averageGrade ? parseFloat(student.averageGrade) : null
        ),
        lastActive: format(student.lastActive, 'PPP'),
        course: course?.title || 'Unknown Course',
      };
    };

    return {
      topPerformers: performanceData.topPerformers.map(mapStudent),
      studentsAtRisk: performanceData.studentsAtRisk.map(mapStudent),
    };
  }, [performanceData, userProfiles, courseDetails]);

  return {
    data: enrichedData,
    isLoading: isLoadingPerformance || isLoadingUsers || isLoadingCourses,
  };
}

export function useEngagementDistribution() {
  return useQuery({
    queryKey: ['instructor', 'engagementDistribution'],
    queryFn: getEngagementDistribution,
  });
}

import {
  getEngagementScore,
  getOverallStats,
  getPerformanceTrends,
  getTotalRevenue,
} from '@/lib/api/analytics';
import { useQueries, useQuery } from '@tanstack/react-query';

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

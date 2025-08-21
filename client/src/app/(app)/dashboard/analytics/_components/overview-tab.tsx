import {
  EngagementRadarChart,
  EngagementRadarChartSkeleton,
} from './engagement-radar';
import {
  MiniPerformanceMetrics,
  MiniPerformanceMetricsSkeleton,
} from './performance-mini-stat';
import {
  PerformanceTrendsChart,
  PerformanceTrendsChartSkeleton,
} from './performence-trends';
import {
  ProgressDistributionChart,
  ProgressDistributionChartSkeleton,
} from './progress-distribution';

export async function OverviewTab() {
  return (
    <div className="space-y-2">
      <MiniPerformanceMetrics />
      <PerformanceTrendsChart />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ProgressDistributionChart />
        <EngagementRadarChart />
      </div>
    </div>
  );
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MiniPerformanceMetricsSkeleton key={index} />
        ))}
      </div>

      <PerformanceTrendsChartSkeleton />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ProgressDistributionChartSkeleton />
        <EngagementRadarChartSkeleton />
      </div>
    </div>
  );
}

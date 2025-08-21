import {
  EngagementPattern,
  EngagementPatternSkeleton,
} from './engagement-pattern';
import {
  PerformanceMetrics,
  PerformanceMetricsSkeleton,
} from './performance-metrics';

export async function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <EngagementPattern />

      <PerformanceMetrics />
    </div>
  );
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <EngagementPatternSkeleton />

      <PerformanceMetricsSkeleton />
    </div>
  );
}

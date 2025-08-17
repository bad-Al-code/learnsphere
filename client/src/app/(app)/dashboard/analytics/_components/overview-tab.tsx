import {
  MiniPerformanceMetrics,
  MiniPerformanceMetricsSkeleton,
} from './performance-mini-stat';

export async function OverviewTab() {
  return (
    <div className="space-y-6">
      <MiniPerformanceMetrics />
    </div>
  );
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MiniPerformanceMetricsSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"></div>
    </div>
  );
}

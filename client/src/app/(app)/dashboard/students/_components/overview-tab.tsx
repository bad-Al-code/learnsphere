import {
  DeviceUsageChart,
  DeviceUsageChartSkeleton,
} from './device-usage-pie-chart';
import {
  StudentDemographics,
  StudentDemographicsSkeleton,
} from './student-demographic';
import { StatCardGrid, StatCardSkeleton } from './student-minit-stat-card';
import {
  SubscriptionAnalysis,
  SubscriptionAnalysisSkeleton,
} from './subscription-analysis';

export async function OverviewTab() {
  return (
    <div className="space-y-2">
      <StatCardGrid />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <StudentDemographics />
        <DeviceUsageChart />
        <SubscriptionAnalysis />
      </div>
    </div>
  );
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StudentDemographicsSkeleton />
        <DeviceUsageChartSkeleton />
        <SubscriptionAnalysisSkeleton />
      </div>
    </div>
  );
}

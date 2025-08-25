import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPerformanceTabData } from '../actions';
import {
  ContentPerformanceTable,
  ContentPerformanceTableSkeleton,
} from './content-performance-table';
import {
  DashboardTabLayout,
  DashboardTabLayoutSkeleton,
} from './dashboard-tab-layout';
import { MiniStatCard, MiniStatCardSkeleton } from './mini-start-card';

export async function PerformanceTab() {
  const { kpis, contentPerformance } = await getPerformanceTabData();

  const mainContent = (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((stat) => (
          <MiniStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            target={stat.target}
          />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentPerformanceTable data={contentPerformance} />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function PerformanceTabSkeleton() {
  const mainContent = (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <MiniStatCardSkeleton key={i} />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContentPerformanceTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayoutSkeleton mainContent={mainContent} />;
}

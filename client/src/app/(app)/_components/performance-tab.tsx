import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ContentPerformanceTable,
  ContentPerformanceTableSkeleton,
} from './content-performance-table';
import { DashboardTabLayout } from './dashboard-tab-layout';
import { MiniStatCard, MiniStatCardSkeleton } from './mini-start-card';

// Placeholder data
const performanceStats = [
  {
    title: 'Average Time Spent',
    value: '2h 30m',
    change: 10,
    target: '2h 45m',
  },
  { title: 'Quiz Success Rate', value: '85%', change: 3, target: '80%' },
  { title: 'Assignment Completion', value: '78%', change: -2, target: '85%' },
  { title: 'Discussion Participation', value: '65%', change: 8, target: '70%' },
  { title: 'Video Watch Time', value: '92%', change: 5, target: '90%' },
  { title: 'Resource Downloads', value: '1,240', change: 15, target: '1,000' },
  { title: 'Forum Posts', value: '2,850', change: 12, target: '2,500' },
  { title: 'Live Session Attendance', value: '68%', change: 6, target: '75%' },
  { title: 'Certificate Completion', value: '52%', change: 8, target: '60%' },
];

const contentPerformanceData = [
  {
    contentType: 'Video Lectures',
    engagementRate: 92,
    completionRate: 88,
    averageRating: 4.7,
    performance: 'Excellent' as const,
  },
  {
    contentType: 'Interactive Quizzes',
    engagementRate: 85,
    completionRate: 94,
    averageRating: 4.5,
    performance: 'Excellent' as const,
  },
  {
    contentType: 'Reading Materials',
    engagementRate: 68,
    completionRate: 72,
    averageRating: 4.2,
    performance: 'Good' as const,
  },
  {
    contentType: 'Assignments',
    engagementRate: 78,
    completionRate: 85,
    averageRating: 4.4,
    performance: 'Good' as const,
  },
  {
    contentType: 'Discussion Forums',
    engagementRate: 65,
    completionRate: 45,
    averageRating: 4.3,
    performance: 'Good' as const,
  },
  {
    contentType: 'Live Sessions',
    engagementRate: 89,
    completionRate: 68,
    averageRating: 4.8,
    performance: 'Excellent' as const,
  },
];

export async function PerformanceTab() {
  const mainContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {performanceStats.map((stat) => (
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
          <ContentPerformanceTable data={contentPerformanceData} />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function PerformanceTabSkeleton() {
  const mainContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

  return <DashboardTabLayout mainContent={mainContent} />;
}

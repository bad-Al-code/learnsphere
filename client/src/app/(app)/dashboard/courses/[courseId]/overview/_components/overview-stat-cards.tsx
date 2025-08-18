import { StatCard } from '@/app/(app)/_components/stat-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';
import { getCourseOverviewData } from '../../../actions';

export async function OverviewStatCards({ courseId }: { courseId: string }) {
  const { stats } = await getCourseOverviewData(courseId);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Students Enrolled"
        value={stats.studentsEnrolled.value}
        change={{
          value: stats.studentsEnrolled.change,
          description: 'this month',
        }}
        icon={Users}
        iconBgColor="bg-emerald-500"
      />
      <StatCard
        title="Completion Rate"
        value={`${stats.completionRate.value}%`}
        change={{
          value: stats.completionRate.change,
          description: 'from last month',
        }}
        icon={CheckCircle}
        iconBgColor="bg-emerald-500"
      />
      <StatCard
        title="Average Rating"
        value={`${stats.averageRating.value} (${stats.averageRating.reviews} reviews)`}
        icon={Star}
        iconBgColor="bg-amber-500"
      />
      <StatCard
        title="Revenue"
        value={formatPrice(stats.revenue.value)}
        change={{ value: stats.revenue.change, description: 'this month' }}
        icon={DollarSign}
        iconBgColor="bg-emerald-500"
      />
      <StatCard
        title="Avg Session Time"
        value={stats.avgSessionTime.value}
        change={{
          value: stats.avgSessionTime.change,
          description: 'from last week',
        }}
        icon={Clock}
        iconBgColor="bg-sky-500"
      />
      <StatCard
        title="Forum Activity"
        value={`${stats.forumActivity.value} posts this month`}
        icon={MessageSquare}
        iconBgColor="bg-sky-500"
      />
      <StatCard
        title="Resource Downloads"
        value={stats.resourceDownloads.value.toLocaleString()}
        change={{
          value: stats.resourceDownloads.change,
          description: 'this week',
        }}
        icon={Download}
        iconBgColor="bg-sky-500"
      />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-7 w-16" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

export function OverviewStatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

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

interface OverviewStatCardsProps {
  data: {
    studentsEnrolled: {
      value: any;
      change: number;
    };
    completionRate: {
      value: any;
      change: number;
    };
    averageRating: {
      value: number;
      reviews: number;
    };
    revenue: {
      value: number;
      change: number;
    };
    avgSessionTime: {
      value: string;
      change: number;
    };
    forumActivity: {
      value: number;
    };
    resourceDownloads: {
      value: number;
      change: number;
    };
  };
}

export async function OverviewStatCards({ data }: OverviewStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Students Enrolled"
        value={data.studentsEnrolled.value}
        change={{
          value: data.studentsEnrolled.change,
          description: 'this month',
        }}
        icon={Users}
        iconBgColor="bg-emerald-500"
      />
      <StatCard
        title="Completion Rate"
        value={`${data.completionRate.value}%`}
        change={{
          value: data.completionRate.change,
          description: 'from last month',
        }}
        icon={CheckCircle}
        iconBgColor="bg-emerald-500"
      />
      <StatCard
        title="Average Rating"
        value={`${data.averageRating.value} (${data.averageRating.reviews} reviews)`}
        icon={Star}
        iconBgColor="bg-amber-500"
      />
      <StatCard
        title="Revenue"
        value={formatPrice(data.revenue.value)}
        change={{ value: data.revenue.change, description: 'this month' }}
        icon={DollarSign}
        iconBgColor="bg-emerald-500"
      />
      <StatCard
        title="Avg Session Time"
        value={data.avgSessionTime.value}
        change={{
          value: data.avgSessionTime.change,
          description: 'from last week',
        }}
        icon={Clock}
        iconBgColor="bg-sky-500"
      />
      <StatCard
        title="Forum Activity"
        value={`${data.forumActivity.value} posts this month`}
        icon={MessageSquare}
        iconBgColor="bg-sky-500"
      />
      <StatCard
        title="Resource Downloads"
        value={data.resourceDownloads.value.toLocaleString()}
        change={{
          value: data.resourceDownloads.change,
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

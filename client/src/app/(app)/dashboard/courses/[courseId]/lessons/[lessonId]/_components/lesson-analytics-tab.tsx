'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, LucideIcon, Star, Users } from 'lucide-react';

interface LessonStat {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
}
interface CompletionData {
  rate: number;
  completedCount: number;
  inProgressCount: number;
}
interface Metric {
  label: string;
  value: string;
}
interface StudentPerformance {
  name: string;
  status: 'Completed' | 'In Progress';
  timeSpent: string;
  lastAccessed: string;
}
interface LessonAnalyticsData {
  stats: LessonStat[];
  completion: CompletionData;
  engagement: Metric[];
  performance: StudentPerformance[];
}

const placeholderData: LessonAnalyticsData = {
  stats: [
    {
      title: 'Students Enrolled',
      value: '187',
      icon: Users,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Completed',
      value: '142',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    {
      title: 'Avg Time',
      value: '12m',
      icon: Clock,
      iconColor: 'text-orange-500',
    },
    { title: 'Rating', value: '4.6', icon: Star, iconColor: 'text-amber-500' },
  ],
  completion: { rate: 76, completedCount: 142, inProgressCount: 45 },
  engagement: [
    { label: 'Avg Watch Time', value: '12m 34s' },
    { label: 'Replay Rate', value: '23%' },
    { label: 'Drop-off Rate', value: '8%' },
  ],
  performance: [
    {
      name: 'Sarah Johnson',
      status: 'Completed',
      timeSpent: '15m 23s',
      lastAccessed: '2 hours ago',
    },
    {
      name: 'Mike Chen',
      status: 'In Progress',
      timeSpent: '8m 45s',
      lastAccessed: '1 day ago',
    },
    {
      name: 'Emma Davis',
      status: 'Completed',
      timeSpent: '12m 10s',
      lastAccessed: '3 hours ago',
    },
  ],
};

function LessonStatCard({ title, value, icon: Icon, iconColor }: LessonStat) {
  return (
    <Card>
      <CardContent className="">
        <p className="text-muted-foreground text-xs">{title}</p>
        <div className="mt-2 flex items-center gap-2">
          <Icon className={cn('h-5 w-5', iconColor)} />
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LessonStatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-24" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function CompletionAnalyticsCard({ data }: { data: CompletionData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Completion Rate</span>
          <span className="font-semibold">{data.rate}%</span>
        </div>
        <Progress value={data.rate} />
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Completed</p>
            <p className="font-bold">{data.completedCount} students</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">In Progress</p>
            <p className="font-bold">{data.inProgressCount} students</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompletionAnalyticsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EngagementMetricsCard({ data }: { data: Metric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between text-sm"
          >
            <p className="text-muted-foreground">{metric.label}</p>
            <p className="font-semibold">{metric.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EngagementMetricsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

function StudentPerformanceTable({ data }: { data: StudentPerformance[] }) {
  const getStatusVariant = (
    status: StudentPerformance['status']
  ): 'default' | 'secondary' => {
    return status === 'Completed' ? 'default' : 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead>Last Accessed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student) => (
              <TableRow key={student.name}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>{student.timeSpent}</TableCell>
                <TableCell className="text-muted-foreground">
                  {student.lastAccessed}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StudentPerformanceTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-28" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface LessonAnalyticsTabProps {
  data?: LessonAnalyticsData;
}

export function LessonAnalyticsTab({
  data = placeholderData,
}: LessonAnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <LessonStatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CompletionAnalyticsCard data={data.completion} />
        <EngagementMetricsCard data={data.engagement} />
      </div>
      <StudentPerformanceTable data={data.performance} />
    </div>
  );
}

export function LessonAnalyticsTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LessonStatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CompletionAnalyticsCardSkeleton />
        <EngagementMetricsCardSkeleton />
      </div>
      <StudentPerformanceTableSkeleton />
    </div>
  );
}

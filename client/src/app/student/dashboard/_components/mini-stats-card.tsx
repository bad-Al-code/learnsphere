'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  AlarmClock,
  Award,
  BookOpen,
  FileText,
  Flame,
  LucideIcon,
  TrendingUp,
} from 'lucide-react';
import {
  useDueSoonCount,
  useMyAverageGrade,
  useMyStudyStreak,
  usePendingAssignmentsCount,
} from '../hooks/use-dashboard-stats';
import { useMyEnrolledCourses } from '../hooks/use-enrollments';

interface StatCardData {
  title: string;
  value: string;
  description: string;
  change?: {
    value: number;
    description: string;
  };
  icon: LucideIcon;
}

function StatCard({ data }: { data: StatCardData }) {
  const isPositive = data.change ? data.change.value >= 0 : true;

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">{data.title}</p>
          <data.icon className="text-muted-foreground h-4 w-4" />
        </div>

        <div className="">
          <p className="text-3xl font-bold">{data.value}</p>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>{data.description}</span>
            {data.change && (
              <span
                className={cn(
                  'flex items-center gap-1',
                  isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                <TrendingUp className="h-3 w-3" />
                {isPositive ? '+' : ''}
                {data.change.value}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardsRow() {
  const { data: enrolledCourses, isLoading: isLoadingCourses } =
    useMyEnrolledCourses();
  const { data: gradeData, isLoading: isLoadingGrade } = useMyAverageGrade();
  const { data: dueSoonData, isLoading: isLoadingDueSoon } = useDueSoonCount();
  const { data: streakData, isLoading: isLoadingStreak } = useMyStudyStreak();
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    usePendingAssignmentsCount();

  const isLoading =
    isLoadingCourses ||
    isLoadingGrade ||
    isLoadingDueSoon ||
    isLoadingStreak ||
    isLoadingAssignments;

  const activeCourses = enrolledCourses?.length ?? 0;
  const avgGrade = gradeData?.averageGrade
    ? `${Math.round(gradeData.averageGrade)}%`
    : 'N/A';
  const dueSoonCount = dueSoonData?.count ?? 0;
  const studyStreak = streakData?.streak ?? 0;
  const pendingAssignments = assignmentsData?.count ?? 0;
  const gradeChange = gradeData?.change ?? 0;

  const stats: StatCardData[] = [
    {
      title: 'Active Courses',
      value: isLoading ? '-' : activeCourses.toString(),
      description: 'Currently enrolled',
      icon: BookOpen,
    },
    {
      title: 'Assignments',
      value: isLoading ? '-' : pendingAssignments.toString(),
      description: 'pending submission',
      icon: FileText,
    },
    {
      title: 'Average Grade',
      value: isLoading ? '-' : avgGrade,
      description: `${gradeChange >= 0 ? '+' : ''}${gradeChange}% from last month`,
      change: { value: gradeChange, description: '' },
      icon: Award,
    },
    {
      title: 'Due Soon',
      value: isLoading ? '-' : dueSoonCount.toString(),
      description: 'Assignments due soon',
      icon: AlarmClock,
    },
    {
      title: 'Study Streak',
      value: isLoading ? '-' : `${studyStreak} days`,
      description: 'Keep it up!',
      icon: Flame,
    },
  ];

  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.title} data={stat} />
      ))}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-1 h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
export function StatCardsRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

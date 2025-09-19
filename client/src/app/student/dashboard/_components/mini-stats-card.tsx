'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  AlarmClock,
  Award,
  BookOpen,
  FileText,
  Flame,
  LucideIcon,
  Pause,
  Play,
  RefreshCw,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  useDueSoonCount,
  useMyAverageGrade,
  useMyStudyStreak,
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

interface StatCardsRowProps {
  data?: StatCardData[];
}

const placeholderData: StatCardData[] = [
  {
    title: 'Active Courses',
    value: '4',
    description: '2 due this week',
    icon: BookOpen,
  },
  {
    title: 'Assignments',
    value: '7',
    description: '3 pending submission',
    icon: FileText,
  },
  {
    title: 'Average Grade',
    value: '87%',
    description: '+2% from last month',
    change: { value: 2, description: '' },
    icon: Award,
  },
  {
    title: 'Study Streak',
    value: '12 days',
    description: 'Keep it up!',
    icon: Flame,
  },
];

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

function StudyTimerCard() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, time]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`.slice(3);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">Study Timer</p>
          <Timer className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex flex-col items-center justify-between space-y-2">
          <div className="text-3xl font-bold">{formatTime(time)}</div>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsActive(!isActive)}
                  >
                    {isActive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isActive ? 'Pause Timer' : 'Start Timer'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleReset}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Timer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

  const isLoading =
    isLoadingCourses || isLoadingGrade || isLoadingDueSoon || isLoadingStreak;

  const activeCourses = enrolledCourses?.length ?? 0;
  const avgGrade = gradeData?.averageGrade
    ? `${Math.round(gradeData.averageGrade)}%`
    : 'N/A';
  const dueSoonCount = dueSoonData?.count ?? 0;
  const studyStreak = streakData?.streak ?? 0;

  const stats: StatCardData[] = [
    {
      title: 'Active Courses',
      value: isLoading ? '-' : activeCourses.toString(),
      description: 'Currently enrolled',
      icon: BookOpen,
    },
    {
      title: 'Assignments',
      value: '7', // Placeholder
      description: '3 pending submission',
      icon: FileText,
    },
    {
      title: 'Average Grade',
      value: isLoading ? '-' : avgGrade,
      description: '+2% from last month', // Placeholder
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
      {/* <StudyTimerCard /> */}
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

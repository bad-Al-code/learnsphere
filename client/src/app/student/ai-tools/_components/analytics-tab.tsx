'use client';

import { faker } from '@faker-js/faker';
import {
  BarChart,
  BookOpen,
  Bot,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TWeeklyPattern = {
  day: string;
  hours: number;
  score: number;
};

type TLearningPattern = {
  label: string;
  value: string;
};

type TSubjectPerformance = {
  subject: string;
  progress: number;
  trend: number;
};

const weeklyPatternData: TWeeklyPattern[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
].map((day) => ({
  day,
  hours: faker.number.float({ min: 2, max: 5, fractionDigits: 1 }),
  score: faker.number.int({ min: 70, max: 95 }),
}));

const learningPatternsData: TLearningPattern[] = [
  { label: 'Best Study Time', value: '9:00 AM - 11:00 AM' },
  { label: 'Avg Session Length', value: '2.3 hours' },
  { label: 'Retention Rate', value: '87%' },
];

const subjectPerformanceData: TSubjectPerformance[] = [
  { subject: 'JavaScript', progress: 85, trend: 12 },
  { subject: 'React', progress: 78, trend: 8 },
  { subject: 'Database Design', progress: 72, trend: -3 },
  { subject: 'UI/UX', progress: 90, trend: 15 },
];

const aiRecommendations: string[] = [
  'Focus more time on Database Design concepts',
  'Continue excellent progress in UI/UX',
  'Consider advanced React patterns',
  'Schedule regular JavaScript practice',
];

function LearningAnalytics() {
  const getScoreColor = (score: number) =>
    score > 80 ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <CardTitle>Learning Analytics</CardTitle>
        </div>
        <CardDescription>
          AI-powered insights into your learning patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 text-sm font-semibold">Weekly Study Pattern</h3>
        <div className="space-y-3">
          {weeklyPatternData.map((item) => (
            <div
              key={item.day}
              className="flex items-center justify-between text-sm"
            >
              <p className="font-medium">{item.day}</p>
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">{item.hours}h</p>
                <p className="flex items-center gap-2 font-semibold">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      getScoreColor(item.score)
                    )}
                  />
                  {item.score}%
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />
        <h3 className="mb-2 text-sm font-semibold">Learning Patterns</h3>
        <div className="space-y-3">
          {learningPatternsData.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <p className="text-muted-foreground">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectPerformance() {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle>Subject Performance</CardTitle>
        </div>
        <CardDescription>
          Track your progress across different subjects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjectPerformanceData.map((item) => (
          <div key={item.subject}>
            <p className="text-sm font-semibold">{item.subject}</p>
            <div className="mt-1 flex items-center gap-4">
              <Progress value={item.progress} className="flex-1" />
              <p className="w-8 text-right text-sm font-semibold">
                {item.progress}%
              </p>
              <div
                className={cn(
                  'flex w-12 items-center gap-1 text-xs font-semibold',
                  item.trend > 0 ? 'text-emerald-500' : 'text-red-500'
                )}
              >
                {item.trend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {item.trend > 0 ? '+' : ''}
                {item.trend}%
              </div>
            </div>
          </div>
        ))}

        <Alert className="border-blue-500/20 bg-blue-500/10">
          <Bot className="h-4 w-4 text-blue-500" />
          <AlertTitle className="font-semibold text-blue-800 dark:text-blue-300">
            AI Recommendations:
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 text-sm text-blue-700 dark:text-blue-400">
              {aiRecommendations.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function LearningAnalyticsSkeleton() {
  return (
    <Card className="">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-5 w-1/3" />
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <Separator className="my-4" />
        <Skeleton className="mb-2 h-5 w-1/3" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectPerformanceSkeleton() {
  return (
    <Card className="">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        ))}
        <Skeleton className="h-28 w-full" />
      </CardContent>
    </Card>
  );
}

export function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <LearningAnalytics />
      <SubjectPerformance />
    </div>
  );
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <LearningAnalyticsSkeleton />
      <SubjectPerformanceSkeleton />
    </div>
  );
}

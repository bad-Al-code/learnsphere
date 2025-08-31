'use client';

import { faker } from '@faker-js/faker';
import { Bot, Lightbulb } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

type TAiTipType = 'focus' | 'optimal' | 'strength';
type TStudyPlanPriority = 'Priority' | 'Recommended' | 'Optional';

type TAiTip = {
  title: string;
  description: string;
  type: TAiTipType;
};

type TStudyPlanStep = {
  step: number;
  title: string;
  estimatedTime: number;
  priority: TStudyPlanPriority;
};

type TAiFeedback = {
  id: string;
  date: string;
  context: string;
  summary: string;
  action: string;
};

const aiTipsData: TAiTip[] = [
  {
    title: 'Focus on CTEs',
    description:
      '2 weak submissions detected. Practice Common Table Expressions.',
    type: 'focus',
  },
  {
    title: 'Optimal Study Time',
    description:
      'You perform best between 2-4 PM. Schedule important topics then.',
    type: 'optimal',
  },
  {
    title: 'Strength Area',
    description:
      'Excellent progress in Database Design. Consider advanced topics.',
    type: 'strength',
  },
];

const studyPlanData: TStudyPlanStep[] = [
  {
    step: 1,
    title: 'Review CTE Fundamentals',
    estimatedTime: 2,
    priority: 'Priority',
  },
  {
    step: 2,
    title: 'Practice Window Functions',
    estimatedTime: 3,
    priority: 'Recommended',
  },
  {
    step: 3,
    title: 'Advanced Query Optimization',
    estimatedTime: 4,
    priority: 'Optional',
  },
];

const aiFeedbackLogData: TAiFeedback[] = Array.from({ length: 3 }, (_, i) => ({
  id: faker.string.uuid(),
  date: faker.date.recent({ days: 10 }).toISOString().split('T')[0],
  context: faker.helpers.arrayElement([
    'CTE Assignment',
    'Window Functions',
    'SQL Quiz',
  ]),
  summary: faker.lorem.sentence(),
  action: faker.lorem.words(3),
}));

function AiGeneratedTips() {
  const tipVariants: Record<TAiTipType, string> = {
    focus:
      'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    optimal:
      'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
    strength:
      'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          <CardTitle>AI-Generated Tips</CardTitle>
        </div>
        <CardDescription>
          Personalized recommendations for improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {aiTipsData.map((tip) => (
          <Alert
            key={tip.title}
            className={cn('flex items-start gap-2', tipVariants[tip.type])}
          >
            <div
              className={cn(
                'mt-1.5 h-2 w-2 rounded-full',
                tip.type === 'focus'
                  ? 'bg-yellow-500'
                  : tip.type === 'optimal'
                    ? 'bg-blue-500'
                    : 'bg-emerald-500'
              )}
            />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <AlertTitle className="font-semibold">{tip.title}</AlertTitle>
              </div>
              <AlertDescription>{tip.description}</AlertDescription>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}

function PersonalizedStudyPlan() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Study Plan</CardTitle>
        <CardDescription>AI-recommended learning path</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {studyPlanData.map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-2 rounded-md border p-4"
          >
            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs">
              {item.step}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground text-xs">
                Estimated: {item.estimatedTime} hours
              </p>
            </div>
            <Badge variant="outline">{item.priority}</Badge>
          </div>
        ))}
        <Button className="w-full">Start Study Plan</Button>
      </CardContent>
    </Card>
  );
}

function AiFeedbackLog() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Feedback Log</CardTitle>
        </div>
        <CardDescription>
          History of AI-generated feedback and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Context</TableHead>
              <TableHead>Feedback Summary</TableHead>
              <TableHead>Suggested Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aiFeedbackLogData.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.date}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.context}</Badge>
                </TableCell>
                <TableCell className="font-medium">{log.summary}</TableCell>
                <TableCell>{log.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AiGeneratedTipsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

function PersonalizedStudyPlanSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

function AiFeedbackLogSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AiInsightsTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <AiGeneratedTips />
      <PersonalizedStudyPlan />
      <div className="lg:col-span-2">
        <AiFeedbackLog />
      </div>
    </div>
  );
}

export function AiInsightsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <AiGeneratedTipsSkeleton />
      <PersonalizedStudyPlanSkeleton />
      <div className="lg:col-span-2">
        <AiFeedbackLogSkeleton />
      </div>
    </div>
  );
}

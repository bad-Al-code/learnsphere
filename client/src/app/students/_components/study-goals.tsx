'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Target } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

interface Goal {
  title: string;
  priority: Priority;
  currentValue: number;
  targetValue: number;
  dueDate: string;
}

interface StudyGoalsProps {
  data?: Goal[];
}

const placeholderData: Goal[] = [
  {
    title: 'Complete React Course',
    priority: 'high',
    currentValue: 75,
    targetValue: 100,
    dueDate: '2024-01-20',
  },
  {
    title: 'Database Certification',
    priority: 'medium',
    currentValue: 45,
    targetValue: 100,
    dueDate: '2024-02-15',
  },
  {
    title: 'Weekly Study Hours',
    priority: 'high',
    currentValue: 18,
    targetValue: 25,
    dueDate: '2024-01-14',
  },
  {
    title: 'Assignment Submissions',
    priority: 'low',
    currentValue: 8,
    targetValue: 10,
    dueDate: '2024-01-31',
  },
];

const getPriorityVariant = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
  }
};

export function StudyGoals({ data = placeholderData }: StudyGoalsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>Study Goals</CardTitle>
        </div>
        <CardDescription>
          Track your learning objectives and milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((goal) => (
          <div key={goal.title}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{goal.title}</p>
                <Badge variant={getPriorityVariant(goal.priority)}>
                  {goal.priority}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm">
                {goal.currentValue}/{goal.targetValue} • Due {goal.dueDate}
              </p>
            </div>
            <Progress value={(goal.currentValue / goal.targetValue) * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StudyGoalsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

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
import { useMyStudyGoals } from '../hooks/use-study-goals';

type Priority = 'high' | 'medium' | 'low';

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

export function StudyGoals() {
  const { data: goals, isLoading, isError } = useMyStudyGoals();

  if (isLoading) return <StudyGoalsSkeleton />;

  if (isError || !goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle>Study Goals</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            {isError ? 'Could not load goals.' : 'No study goals set yet.'}
          </p>
        </CardContent>
      </Card>
    );
  }

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
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{goal.title}</p>
                <Badge variant={getPriorityVariant(goal.priority)}>
                  {goal.priority}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm">
                {goal.currentValue}/{goal.targetValue} • Due{' '}
                {new Date(goal.targetDate).toLocaleDateString()}
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

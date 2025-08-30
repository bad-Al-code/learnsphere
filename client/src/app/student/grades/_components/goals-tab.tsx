'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar as CalendarIcon, Target } from 'lucide-react';
import { useState } from 'react';

type TGoalPriority = 'low priority' | 'medium priority' | 'high priority';

type TGoal = {
  id: string;
  title: string;
  progress: number;
  target: number;
  deadline: string;
  priority: TGoalPriority;
};

const goalsData: TGoal[] = [
  {
    id: '1',
    title: 'Complete React Course',
    progress: 85,
    target: 100,
    deadline: '2024-02-15',
    priority: 'high priority',
  },
  {
    id: '2',
    title: 'Maintain 90+ Average',
    progress: 88,
    target: 90,
    deadline: '2024-03-01',
    priority: 'medium priority',
  },
  {
    id: '3',
    title: 'Finish 5 Projects',
    progress: 3,
    target: 5,
    deadline: '2024-02-28',
    priority: 'high priority',
  },
  {
    id: '4',
    title: 'Study 20hrs/week',
    progress: 18,
    target: 20,
    deadline: 'Ongoing',
    priority: 'low priority',
  },
];

function AddNewGoal() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardContent className="">
        <h3 className="mb-2 text-lg font-semibold">Add New Goal</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-2">
          <div>
            <label className="text-sm font-medium">Goal Description</label>
            <Input placeholder="e.g., Complete JavaScript Course" />
          </div>
          <div>
            <label className="text-sm font-medium">Target Value</label>
            <Input type="number" placeholder="e.g., 100" />
          </div>
          <div>
            <label className="text-sm font-medium">Deadline</label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="h-4 w-4" />
                  dd/mm/yyyy
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                  }}
                  className="rounded-md border shadow-sm"
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="mt-4">Add Goal</Button>
      </CardContent>
    </Card>
  );
}

function GoalItem({ goal }: { goal: TGoal }) {
  const percentage = Math.round((goal.progress / goal.target) * 100);

  return (
    <Card>
      <CardContent className="">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="font-semibold">{goal.title}</h4>
          <Badge
            variant={
              goal.priority === 'high priority'
                ? 'destructive'
                : goal.priority === 'medium priority'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {goal.priority}
          </Badge>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Progress: {goal.progress}/{goal.target}
          </p>
          <p className="text-sm font-semibold">{percentage}%</p>
        </div>
        <Progress value={percentage} className="mb-2 h-2" />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Deadline: {goal.deadline}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Complete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalList() {
  return (
    <div className="space-y-2">
      {goalsData.map((goal) => (
        <GoalItem key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

function AddNewGoalSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <Skeleton className="mb-4 h-6 w-1/4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-24" />
      </CardContent>
    </Card>
  );
}

function GoalItemSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="mb-2 flex items-start justify-between">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="mb-2 h-2 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <GoalItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function GoalsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>Goal Tracking & Achievement</CardTitle>
        </div>
        <CardDescription>
          Set, track, and achieve your academic goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <AddNewGoal />
        <GoalList />
      </CardContent>
    </Card>
  );
}

export function GoalsTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <AddNewGoalSkeleton />
        <GoalListSkeleton />
      </CardContent>
    </Card>
  );
}

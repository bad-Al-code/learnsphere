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

type Deadline = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  submitted: number;
  total: number;
};
const deadlines: Deadline[] = [
  {
    id: 1,
    title: 'Data Science Assignment 4',
    course: 'Data Science',
    dueDate: '12/18/2024 at 23:59',
    submitted: 18,
    total: 25,
  },
  {
    id: 2,
    title: 'Web Development Final Project',
    course: 'Web Development',
    dueDate: '12/20/2024 at 23:59',
    submitted: 12,
    total: 20,
  },
  {
    id: 3,
    title: 'Marketing Campaign Proposal',
    course: 'Digital Marketing',
    dueDate: '12/19/2024 at 17:00',
    submitted: 15,
    total: 22,
  },
];

export async function UpcomingDeadlines() {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(2000);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Assignment and project due dates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="border-border space-y-2 border-b pb-4 last:border-b-0"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-semibold">{deadline.title}</h4>
              <Badge variant="secondary">{deadline.course}</Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Due: {deadline.dueDate}
            </p>
            <p className="text-muted-foreground text-xs">
              {deadline.submitted}/{deadline.total} submitted
            </p>
            <div className="flex items-center gap-2">
              <Progress
                value={(deadline.submitted / deadline.total) * 100}
                className="h-2"
              />
              <span className="text-muted-foreground font-mono text-xs">
                {Math.round((deadline.submitted / deadline.total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function UpcomingDeadlinesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-1 h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2 border-b pb-4 last:border-b-0">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

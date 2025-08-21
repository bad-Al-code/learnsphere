import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type TopPerformer = {
  name: string;
  course: string;
  score: number;
  change: number;
};

const topPerformersData: TopPerformer[] = [
  { name: 'Sarah Chen', course: 'Data Science', score: 96, change: 8 },
  {
    name: 'Michael Rodriguez',
    course: 'Web Development',
    score: 94,
    change: 5,
  },
  { name: 'Emma Thompson', course: 'Digital Marketing', score: 91, change: 12 },
  { name: 'David Kim', course: 'Graphic Design', score: 89, change: 3 },
  { name: 'Lisa Wang', course: 'Data Science', score: 87, change: 15 },
];

export function StudentTopPerformers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>
          Students with highest performance and improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {topPerformersData.map((student, index) => (
          <div
            key={student.name}
            className="flex items-center justify-between rounded-lg bg-green-500/10 p-3"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-700">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-muted-foreground text-sm">
                  {student.course}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{student.score}%</p>
              <p className="text-sm font-medium text-green-600">
                +{student.change}%
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StudentTopPerformersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-64" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg p-3"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

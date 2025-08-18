import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';

interface TopPerformersProps {
  data: {
    student: { name: string; avatarUrl?: string };
    progress: number;
    grade: string;
  }[];
}

export function TopPerformers({ data }: TopPerformersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((perf, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={perf.student.avatarUrl}
                alt={perf.student.name}
              />
              <AvatarFallback>{getInitials(perf.student.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm leading-none font-medium">
                {perf.student.name}
              </p>
              <Progress value={perf.progress} className="h-2" />
            </div>
            <div className="text-sm font-bold">{perf.grade}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TopPerformersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-5 w-6" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

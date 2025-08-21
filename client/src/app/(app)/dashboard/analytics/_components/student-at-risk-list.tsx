import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown } from 'lucide-react';

type AtRiskStudent = {
  name: string;
  course: string;
  score: number;
  change: number;
  lastActivity: string;
};

const atRiskStudentsData: AtRiskStudent[] = [
  {
    name: 'Alex Johnson',
    course: 'Web Development',
    score: 58,
    change: -12,
    lastActivity: '5 days ago',
  },
  {
    name: 'Maria Garcia',
    course: 'Digital Marketing',
    score: 62,
    change: -8,
    lastActivity: '3 days ago',
  },
  {
    name: 'James Wilson',
    course: 'Data Science',
    score: 55,
    change: -15,
    lastActivity: '1 week ago',
  },
  {
    name: 'Sophie Brown',
    course: 'Graphic Design',
    score: 64,
    change: -6,
    lastActivity: '2 days ago',
  },
];

export function AtRiskStudents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>At-Risk Students</CardTitle>
        <CardDescription>Students who need additional support</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {atRiskStudentsData.map((student) => (
          <div
            key={student.name}
            className="flex items-center justify-between rounded-lg bg-red-500/10 p-3"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-600">
                <TrendingDown className="h-4 w-4" />
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
              <p className="text-sm font-medium text-red-600">
                {student.change}%
              </p>
              <p className="text-muted-foreground text-xs">
                {student.lastActivity}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AtRiskStudentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-56" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
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
              <Skeleton className="mt-1 h-3 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

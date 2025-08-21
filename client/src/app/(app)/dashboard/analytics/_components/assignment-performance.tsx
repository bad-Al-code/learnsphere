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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AssignmentPerformanceData = {
  assignment: string;
  avgScore: number;
  submissionRate: number;
  onTimeRate: number;
  avgTimeSpent: string;
};

const assignmentData: AssignmentPerformanceData[] = [
  {
    assignment: 'Assignment 1',
    avgScore: 88,
    submissionRate: 95,
    onTimeRate: 92,
    avgTimeSpent: '2.5h',
  },
  {
    assignment: 'Assignment 2',
    avgScore: 82,
    submissionRate: 89,
    onTimeRate: 85,
    avgTimeSpent: '3.2h',
  },
  {
    assignment: 'Assignment 3',
    avgScore: 85,
    submissionRate: 92,
    onTimeRate: 88,
    avgTimeSpent: '2.8h',
  },
  {
    assignment: 'Midterm Exam',
    avgScore: 79,
    submissionRate: 98,
    onTimeRate: 96,
    avgTimeSpent: '1.5h',
  },
  {
    assignment: 'Final Project',
    avgScore: 91,
    submissionRate: 87,
    onTimeRate: 78,
    avgTimeSpent: '8.5h',
  },
];

export function AssignmentPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Performance</CardTitle>
        <CardDescription>
          Performance metrics for course assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Assignment</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Submission Rate</TableHead>
              <TableHead>On-Time Rate</TableHead>
              <TableHead>Avg Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignmentData.map((data) => (
              <TableRow key={data.assignment}>
                <TableCell className="font-medium">{data.assignment}</TableCell>
                <TableCell>
                  <Badge variant="default">{data.avgScore}%</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={data.submissionRate}
                      className="h-2 w-16"
                    />
                    <span>{data.submissionRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{data.onTimeRate}%</Badge>
                </TableCell>
                <TableCell>{data.avgTimeSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AssignmentPerformanceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-80" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between px-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
          <hr />

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2"
            >
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-14 rounded-full" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-14 rounded-full" />
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

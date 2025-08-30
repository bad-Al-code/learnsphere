'use client';

import { Badge } from '@/components/ui/badge';
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
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

type TPerformance = 'Excellent' | 'Good' | 'Needs Focus';

type TCourseComparison = {
  id: string;
  courseName: string;
  progress: number;
  averageGrade: string;
  hoursSpent: string;
  performance: TPerformance;
};

const comparisonData: TCourseComparison[] = [
  {
    id: '1',
    courseName: 'React Fundamentals',
    progress: 75,
    averageGrade: 'A-',
    hoursSpent: '45h',
    performance: 'Excellent',
  },
  {
    id: '2',
    courseName: 'Database Design',
    progress: 45,
    averageGrade: 'B+',
    hoursSpent: '32h',
    performance: 'Good',
  },
  {
    id: '3',
    courseName: 'UI/UX Principles',
    progress: 90,
    averageGrade: 'A',
    hoursSpent: '38h',
    performance: 'Excellent',
  },
  {
    id: '4',
    courseName: 'Python Programming',
    progress: 30,
    averageGrade: 'B',
    hoursSpent: '28h',
    performance: 'Needs Focus',
  },
];

export function ComparisonTab() {
  const performanceIndicator = (performance: TPerformance) => {
    switch (performance) {
      case 'Excellent':
        return (
          <span className="flex items-center gap-2 text-green-500">
            <TrendingUp className="h-4 w-4" />
            {performance}
          </span>
        );
      case 'Good':
        return (
          <span className="flex items-center gap-2 text-yellow-500">
            <Minus className="h-4 w-4" />
            {performance}
          </span>
        );
      case 'Needs Focus':
        return (
          <span className="flex items-center gap-2 text-red-500">
            <TrendingDown className="h-4 w-4" />
            {performance}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Course Comparison</h2>
        <p className="text-muted-foreground">
          Compare your progress across different courses
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Course</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Average Grade</TableHead>
              <TableHead>Hours Spent</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">
                  {course.courseName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={course.progress} className="h-2 w-16" />
                    <span className="text-sm font-medium">
                      {course.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{course.averageGrade}</Badge>
                </TableCell>
                <TableCell>{course.hoursSpent}</TableCell>
                <TableCell>
                  {performanceIndicator(course.performance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ComparisonTabSkeleton() {
  return (
    <div className="space-y-2">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-16" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-8 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getInitials } from '@/lib/utils';

interface TopStudentsTableProps {
  data: {
    student: {
      name: string;
      avatarUrl?: string;
    };
    course: string;
    progress: number;
    grade: string;
    lastActive: string;
  }[];
}

export function TopStudentsTable({ data }: TopStudentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead className="text-right">Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={row.student.avatarUrl} />
                  <AvatarFallback>
                    {getInitials(row.student.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{row.student.name}</span>
              </div>
            </TableCell>
            <TableCell>{row.course}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.progress} className="h-2 w-20" />
                <span>{row.progress}%</span>
              </div>
            </TableCell>
            <TableCell>{row.grade}</TableCell>
            <TableCell className="text-right">{row.lastActive}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TopStudentsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

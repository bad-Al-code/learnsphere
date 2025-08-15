'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { getInitials } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface RecentEnrollmentsTableProps {
  data: {
    studentName: string;
    course: string;
    enrolledDate: string;
    status: 'Active' | 'Inactive';
    progress: number;
  }[];
}

export function RecentEnrollmentsTable({ data }: RecentEnrollmentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Enrolled Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getInitials(row.studentName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{row.studentName}</span>
              </div>
            </TableCell>
            <TableCell>{row.course}</TableCell>
            <TableCell>{row.enrolledDate}</TableCell>
            <TableCell>
              <Badge
                variant={row.status === 'Active' ? 'default' : 'destructive'}
              >
                {row.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.progress} className="h-2 w-20" />
                <span>{row.progress}%</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Eye className="text-muted-foreground hover:text-primary h-5 w-5 cursor-pointer" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function RecentEnrollmentsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-28" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-28" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="ml-auto h-4 w-16" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-5 w-5" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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

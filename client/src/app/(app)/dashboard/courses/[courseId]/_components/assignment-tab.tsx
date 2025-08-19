'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreHorizontal, Plus } from 'lucide-react';

type AssignmentStatusType = 'Active' | 'Upcoming' | 'Completed';

interface Assignment {
  title: string;
  points: number;
  type: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  avgGrade: string;
  status: AssignmentStatusType;
}

interface AssignmentsTabProps {
  data?: Assignment[];
}

const placeholderData: Assignment[] = [
  {
    title: 'Data Analysis Project',
    points: 100,
    type: 'Project',
    dueDate: 'July 15, 2024',
    submissions: 180,
    totalStudents: 250,
    avgGrade: 'B+',
    status: 'Active',
  },
  {
    title: 'Machine Learning Model',
    points: 150,
    type: 'Project',
    dueDate: 'July 22, 2024',
    submissions: 120,
    totalStudents: 250,
    avgGrade: 'A-',
    status: 'Active',
  },
  {
    title: 'Final Capstone Project',
    points: 200,
    type: 'Capstone',
    dueDate: 'August 1, 2024',
    submissions: 45,
    totalStudents: 250,
    avgGrade: 'A',
    status: 'Upcoming',
  },
  {
    title: 'Weekly Quiz - Statistics',
    points: 50,
    type: 'Quiz',
    dueDate: 'July 8, 2024',
    submissions: 230,
    totalStudents: 250,
    avgGrade: 'B',
    status: 'Completed',
  },
];

const getStatusBadgeVariant = (
  status: AssignmentStatusType
): 'default' | 'outline' | 'secondary' => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Upcoming':
      return 'secondary';
    case 'Completed':
      return 'outline';
  }
};

export function AssignmentsTab({
  data = placeholderData,
}: AssignmentsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Course Assignments</h2>
          <p className="text-muted-foreground">
            Manage assignments and track student submissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Overview</CardTitle>
          <CardDescription>
            Track assignment performance and submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Avg Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((assignment) => (
                <TableRow key={assignment.title}>
                  <TableCell className="font-medium">
                    <div>{assignment.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {assignment.points} points
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{assignment.type}</Badge>
                  </TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (assignment.submissions / assignment.totalStudents) *
                          100
                        }
                        className="h-2 w-16"
                      />
                      <span className="text-muted-foreground text-sm">
                        {assignment.submissions}/{assignment.totalStudents}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {assignment.avgGrade}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Submissions</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function AssignmentsTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-28" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

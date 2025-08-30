'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Filter, Search, Upload } from 'lucide-react';

type TAssignmentStatus = 'Submitted' | 'Graded' | 'Pending';

type TAssignment = {
  id: string;
  title: string;
  dueDate: string;
  status: TAssignmentStatus;
  grade?: string;
  feedback?: string;
  submissionDate?: string;
};

const assignmentsData: TAssignment[] = [
  {
    id: '1',
    title: 'React Todo App',
    dueDate: '2024-01-15',
    status: 'Submitted',
    feedback: 'Good work on component structure',
    submissionDate: '2024-01-14',
  },
  {
    id: '2',
    title: 'State Management Project',
    dueDate: '2024-01-20',
    status: 'Graded',
    grade: 'A-',
    feedback: 'Good use of hooks, minor optimization needed',
    submissionDate: '2024-01-19',
  },
  {
    id: '3',
    title: 'API Integration',
    dueDate: '2024-01-25',
    status: 'Pending',
    grade: '-',
    feedback: '-',
    submissionDate: '2024-01-24',
  },
  {
    id: '4',
    title: 'Component Library UI',
    dueDate: '2024-02-05',
    status: 'Graded',
    grade: 'B+',
    feedback: 'Solid implementation, consider edge cases.',
    submissionDate: '2024-02-01',
  },
];

export function AssignmentsTab() {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Assignment Submissions</h2>
        <p className="text-muted-foreground">
          Track your assignment progress and feedback
        </p>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-2 sm:flex-row">
          <div className="relative w-full flex-grow sm:w-auto">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search assignments..." className="pl-9" />
          </div>

          <div>
            <div className="hidden sm:block">
              <Select defaultValue="all">
                <SelectTrigger className="">
                  <SelectValue placeholder="Filter assignments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter assignments</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div>
            <Button variant="outline" className="hidden sm:flex">
              <Upload className="h-4 w-4" />
              Export
            </Button>
            <div className="sm:hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </TooltipProvider>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Grade</TableHead>
              <TableHead className="hidden lg:table-cell">Feedback</TableHead>
              <TableHead className="hidden md:table-cell">
                Submission Date
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignmentsData.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">
                  {assignment.title}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {assignment.dueDate}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      assignment.status === 'Graded' &&
                        'border-green-500 text-green-500',
                      assignment.status === 'Pending' &&
                        'border-yellow-500 text-yellow-500'
                    )}
                  >
                    {assignment.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {assignment.grade ?? '-'}
                </TableCell>
                <TableCell className="text-muted-foreground hidden max-w-xs truncate text-sm lg:table-cell">
                  {assignment.feedback ?? '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {assignment.submissionDate}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    {assignment.status === 'Graded' && (
                      <Button variant="secondary" size="sm">
                        Feedback
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function AssignmentsTabSkeleton() {
  return (
    <div className="space-y-2">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="flex items-center gap-2 sm:flex-row">
        <Skeleton className="h-10 w-8 flex-grow" />
        <Skeleton className="hidden h-10 w-[140px] sm:block" />
        <Skeleton className="h-10 w-10 rounded-md sm:hidden" />
        <Skeleton className="hidden h-10 w-[90px] sm:block" />
        <Skeleton className="h-10 w-10 rounded-md sm:hidden" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 7 }).map((_, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    (i === 1 || i === 5) && 'hidden md:table-cell',
                    (i === 3 || i === 4) && 'hidden lg:table-cell'
                  )}
                >
                  <Skeleton className="h-5 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-8" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

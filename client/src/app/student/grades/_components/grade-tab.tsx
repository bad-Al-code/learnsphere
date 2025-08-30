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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { useState } from 'react';

type TGradeStatus = 'Graded' | 'Pending';
type TGradeDetail = {
  id: string;
  course: string;
  assignment: string;
  module: string;
  grade?: number;
  status: TGradeStatus;
  submitted: string;
};

const gradesData: TGradeDetail[] = [
  {
    id: '1',
    course: 'React Fundamentals',
    assignment: 'Component Architecture',
    module: 'Module 8',
    grade: 92,
    status: 'Graded',
    submitted: '2024-01-08',
  },
  {
    id: '2',
    course: 'Database Design',
    assignment: 'Schema Normalization',
    module: 'Module 4',
    grade: 88,
    status: 'Graded',
    submitted: '2024-01-05',
  },
  {
    id: '3',
    course: 'UI/UX Principles',
    assignment: 'User Research Report',
    module: 'Module 6',
    grade: 95,
    status: 'Graded',
    submitted: '2024-01-10',
  },
  {
    id: '4',
    course: 'Python Programming',
    assignment: 'Data Analysis Project',
    module: 'Module 3',
    grade: 85,
    status: 'Graded',
    submitted: '2024-01-07',
  },
  {
    id: '5',
    course: 'React Fundamentals',
    assignment: 'Hooks Implementation',
    module: 'Module 9',
    status: 'Pending',
    submitted: '2024-01-11',
  },
];

const courseFilters = [
  'All Courses',
  'React Fundamentals',
  'Database Design',
  'UI/UX Principles',
  'Python Programming',
];
const gradeFilters = [
  'All Grades',
  'A (90-100)',
  'B (80-89)',
  'C (70-79)',
  'Pending',
];
const timeFilters = ['All Time', 'This Week', 'This Month', 'This Semester'];

function GradesHeader() {
  const [course, setCourse] = useState('All Courses');
  const [grade, setGrade] = useState('All Grades');
  const [time, setTime] = useState('All Time');

  return (
    <TooltipProvider delayDuration={0}>
      <header>
        {/* --- Desktop & Tablet View --- */}
        <div className="hidden items-center gap-2 md:flex">
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              {courseFilters.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              {gradeFilters.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              {timeFilters.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <FileSpreadsheet className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Export CSV</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export CSV</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Export PDF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export PDF</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* --- Mobile View --- */}
        <div className="flex items-center gap-2 md:hidden">
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={course}
                  onValueChange={setCourse}
                >
                  {courseFilters.map((f) => (
                    <DropdownMenuRadioItem key={f} value={f}>
                      {f}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>
              <p>Filter Course</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={grade} onValueChange={setGrade}>
                  {gradeFilters.map((f) => (
                    <DropdownMenuRadioItem key={f} value={f}>
                      {f}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>
              <p>Filter Grade</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Clock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={time} onValueChange={setTime}>
                  {timeFilters.map((f) => (
                    <DropdownMenuRadioItem key={f} value={f}>
                      {f}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>
              <p>Filter Time</p>
            </TooltipContent>
          </Tooltip>

          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export CSV</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export PDF</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

function GradesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Details</CardTitle>
        <CardDescription>
          Detailed breakdown of all your assignments and grades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradesData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.course}</TableCell>
                  <TableCell>{item.assignment}</TableCell>
                  <TableCell>{item.module}</TableCell>
                  <TableCell>
                    {item.grade ? (
                      <Badge>{item.grade}%</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.submitted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function GradesHeaderSkeleton() {
  return (
    <header>
      <div className="hidden items-center gap-2 md:flex">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </header>
  );
}

function GradesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-5 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function GradesTab() {
  return (
    <div className="space-y-2">
      <GradesHeader />
      <GradesTable />
    </div>
  );
}

export function GradesTabSkeleton() {
  return (
    <div className="space-y-2">
      <GradesHeaderSkeleton />
      <GradesTableSkeleton />
    </div>
  );
}

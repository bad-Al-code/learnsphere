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
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  BarChart2,
  Calendar,
  Clock,
  Eye,
  Filter,
  Play,
  Search,
  Sparkles,
} from 'lucide-react';

type TAIRecommendation = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  hours: number;
  dueDate: string;
};
type TPendingAssignment = {
  id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  isOverdue: boolean;
  type: 'individual' | 'collaborative';
  status: 'Not Started' | 'In Progress';
  points: number;
};

const recommendationsData: TAIRecommendation[] = [
  {
    id: '1',
    priority: 'high',
    title: 'Database Schema Design',
    description: 'Focus on normalization concepts today. Review 3NF examples.',
    hours: 2,
    dueDate: '2024-01-12',
  },
  {
    id: '2',
    priority: 'medium',
    title: 'React Component Library',
    description: 'Complete TypeScript interfaces. Test component props.',
    hours: 3,
    dueDate: '2024-01-15',
  },
  {
    id: '3',
    priority: 'low',
    title: 'Python Data Analysis',
    description: 'Start with data cleaning. Review pandas documentation.',
    hours: 1.5,
    dueDate: '2024-01-20',
  },
];
const pendingAssignmentsData: TPendingAssignment[] = [
  {
    id: '1',
    title: 'Database Schema Design',
    description:
      'Design a normalized database schema for an e-commerce platform',
    course: 'Database Design',
    dueDate: '2024-01-12 at 11:59 PM',
    isOverdue: true,
    type: 'individual',
    status: 'Not Started',
    points: 100,
  },
  {
    id: '2',
    title: 'React Component Library',
    description: 'Create a reusable component library with TypeScript',
    course: 'React Fundamentals',
    dueDate: '2024-01-15 at 11:59 PM',
    isOverdue: true,
    type: 'collaborative',
    status: 'In Progress',
    points: 150,
  },
  {
    id: '3',
    title: 'User Research Report',
    description: 'Conduct user interviews and compile findings',
    course: 'UI/UX Principles',
    dueDate: '2024-01-18 at 11:59 PM',
    isOverdue: true,
    type: 'individual',
    status: 'Not Started',
    points: 80,
  },
  {
    id: '4',
    title: 'Python Data Analysis',
    description: 'Analyze sales data using pandas and matplotlib',
    course: 'Python Programming',
    dueDate: '2024-01-20 at 11:59 PM',
    isOverdue: false,
    type: 'individual',
    status: 'Not Started',
    points: 120,
  },
];

export function UpcomingHeader() {
  return (
    <header>
      {/* Desktop View */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search assignments..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="">
            <SelectValue placeholder="All Assignments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="high-priority">High Priority</SelectItem>
            <SelectItem value="collaborative">Collaborative</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
          <Button variant="outline">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search..." className="pl-9" />
        </div>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <Select defaultValue="all">
              <TooltipTrigger asChild>
                <SelectTrigger>
                  <Filter className="h-4 w-4" />
                </SelectTrigger>
              </TooltipTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="high-priority">High Priority</SelectItem>
                <SelectItem value="collaborative">Collaborative</SelectItem>
              </SelectContent>
            </Select>
            <TooltipContent>
              <p>Filter</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Calendar</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <BarChart2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Analytics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}

export function AIRecommendationItem({ item }: { item: TAIRecommendation }) {
  const priorityClasses = {
    high: 'bg-red-500/10 text-red-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-gray-500/10 text-gray-500',
  };
  return (
    <div className="hover:bg-card flex flex-col items-start gap-4 rounded-lg border p-3 sm:flex-row">
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <Badge className={`capitalize ${priorityClasses[item.priority]}`}>
            {item.priority} Priority
          </Badge>
          <h4 className="font-semibold">{item.title}</h4>
        </div>

        <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>

        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.hours} hours
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Due {item.dueDate}
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="mt-2 w-full sm:mt-0 sm:w-auto"
      >
        <Calendar className="mr-1 h-4 w-4" />
        Schedule
      </Button>
    </div>
  );
}

function AIStudyPlanner() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <CardTitle>AI Study Planner</CardTitle>
        </div>
        <CardDescription>
          Personalized study recommendations for your assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendationsData.map((item) => (
          <AIRecommendationItem key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}

function PendingAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Assignments</CardTitle>
        <CardDescription>
          Complete these assignments before their due dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">
                  <Checkbox />
                </TableHead>
                <TableHead className="">Assignment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAssignmentsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell>{item.course}</TableCell>
                  <TableCell>
                    <div>
                      {item.isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <div className="text-xs">{item.dueDate}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.points} pts</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingHeaderSkeleton() {
  return (
    <header>
      <div className="hidden items-center gap-2 md:flex">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-[180px]" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </header>
  );
}

function AIRecommendationItemSkeleton() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border p-3 sm:flex-row">
      <Skeleton className="h-6 w-24 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-4 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-full sm:w-28" />
    </div>
  );
}

function AIStudyPlannerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-2">
        <AIRecommendationItemSkeleton />
        <AIRecommendationItemSkeleton />
        <AIRecommendationItemSkeleton />
      </CardContent>
    </Card>
  );
}

function PendingAssignmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-5 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
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

export function UpcomingTab() {
  return (
    <div className="space-y-2">
      <UpcomingHeader />
      <AIStudyPlanner />
      <PendingAssignments />
    </div>
  );
}

export function UpcomingTabSkeleton() {
  return (
    <div className="space-y-2">
      <UpcomingHeaderSkeleton />
      <AIStudyPlannerSkeleton />
      <PendingAssignmentsSkeleton />
    </div>
  );
}

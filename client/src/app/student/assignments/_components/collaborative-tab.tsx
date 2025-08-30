'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  CircleDot,
  ListTodo,
  MessageSquare,
  Share2,
  Users,
} from 'lucide-react';

type TTeamMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  isOnline: boolean;
};
type TTaskStatus = 'completed' | 'in-progress' | 'todo';
type TTask = {
  id: string;
  name: string;
  status: TTaskStatus;
  assignee: string;
};
type TCollaborativeAssignment = {
  id: string;
  title: string;
  course: string;
  lastActivity: string;
  progress: number;
  members: TTeamMember[];
  tasks: TTask[];
};

const assignmentData: TCollaborativeAssignment = {
  id: '1',
  title: 'React Component Library',
  course: 'React Fundamentals',
  lastActivity: '2h ago',
  progress: 65,
  members: [
    {
      id: '1',
      name: 'Alex Smith',
      initials: 'AS',
      role: 'Lead Developer',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Emma Wilson',
      initials: 'EW',
      role: 'UI Designer',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      initials: 'MJ',
      role: 'Tester',
      isOnline: false,
    },
  ],
  tasks: [
    {
      id: '1',
      name: 'Button Component',
      status: 'completed',
      assignee: 'Alex Smith',
    },
    {
      id: '2',
      name: 'Form Components',
      status: 'in-progress',
      assignee: 'Emma Wilson',
    },
    { id: '3', name: 'Unit Tests', status: 'todo', assignee: 'Mike Johnson' },
  ],
};

function TeamMember({ member }: { member: TTeamMember }) {
  return (
    <div className="bg-muted/40 flex items-center gap-2 rounded-lg px-4 py-3">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{member.initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          {member.name}
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              member.isOnline ? 'bg-green-500' : 'bg-gray-500'
            )}
          />
        </p>
        <p className="text-muted-foreground text-xs">{member.role}</p>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: TTask }) {
  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    'in-progress': (
      <CircleDot className="h-4 w-4 animate-pulse text-blue-500" />
    ),
    todo: <Circle className="text-muted-foreground h-4 w-4" />,
  };
  return (
    <div className="hover:bg-muted/40 flex flex-col items-start justify-between rounded-md p-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 font-medium">
        {statusIcons[task.status]} {task.name}
      </div>
      <p className="text-muted-foreground pl-6 text-xs sm:pl-0 sm:text-sm">
        {task.assignee}
      </p>
    </div>
  );
}

function CollaborativeAssignmentCard({
  assignment,
}: {
  assignment: TCollaborativeAssignment;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignment.title}</CardTitle>
        <CardDescription>
          {assignment.course} • Last activity: {assignment.lastActivity}
        </CardDescription>
        <CardAction>
          <div className="flex-shrink-0 text-right">
            <p className="text-xl font-bold">{assignment.progress}%</p>
            <p className="text-muted-foreground text-xs">Complete</p>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Team Members</h3>
          <div className="flex flex-wrap gap-2">
            {assignment.members.map((m) => (
              <TeamMember key={m.id} member={m} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-1 font-semibold">Task Progress</h3>
          <div className="space-y-1">
            {assignment.tasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Progress value={assignment.progress} className="h-2" />
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  <span className="inline">Team Chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden">
                <p>Team Chat</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <ListTodo className="h-4 w-4" />
                  <span className="inline">View Tasks</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden">
                <p>View Tasks</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share Progress</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden">
                <p>Share Progress</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}

function CollaborativeAssignmentCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-7 w-56" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
        <CardAction>
          <div className="space-y-1 text-right">
            <Skeleton className="ml-auto h-7 w-16" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Skeleton className="mb-2 h-5 w-32" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-40 rounded-lg" />
          </div>
        </div>
        <div>
          <Skeleton className="mb-2 h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Skeleton className="h-2 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 md:w-32" />
          <Skeleton className="h-10 w-10 md:w-32" />
          <Skeleton className="h-10 w-10 md:w-36" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function CollaborativeTab() {
  return (
    <div className="space-y-2">
      <header>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Collaborative Assignments</h2>
        </div>
        <p className="text-muted-foreground">
          Work together with classmates on group projects
        </p>
      </header>
      <CollaborativeAssignmentCard assignment={assignmentData} />
    </div>
  );
}

export function CollaborativeTabSkeleton() {
  return (
    <div className="space-y-2">
      <header>
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-2 h-4 w-80" />
      </header>
      <CollaborativeAssignmentCardSkeleton />
    </div>
  );
}

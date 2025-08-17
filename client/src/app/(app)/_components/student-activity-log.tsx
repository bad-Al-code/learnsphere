'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getInitials } from '@/lib/utils';

type ActivityType =
  | 'assignment'
  | 'discussion'
  | 'video'
  | 'quiz'
  | 'download'
  | 'completion'
  | 'question'
  | 'missed';

interface ActivityLogItem {
  studentName: string;
  action: string;
  course: string;
  timestamp: string;
  type: ActivityType;
}

interface StudentActivityLogProps {
  data?: ActivityLogItem[];
}

const placeholderData: ActivityLogItem[] = [
  {
    studentName: 'John Doe',
    action: 'Submitted Assignment',
    course: 'Introduction to React',
    timestamp: '2 hours ago',
    type: 'assignment',
  },
  {
    studentName: 'Jane Smith',
    action: 'Started a Discussion',
    course: 'Advanced JavaScript',
    timestamp: '3 hours ago',
    type: 'discussion',
  },
  {
    studentName: 'Alice Johnson',
    action: 'Watched Video Lecture',
    course: 'Data Structures and Algorithms',
    timestamp: '5 hours ago',
    type: 'video',
  },
  {
    studentName: 'Bob Williams',
    action: 'Completed Quiz',
    course: 'Node.js Fundamentals',
    timestamp: '7 hours ago',
    type: 'quiz',
  },
  {
    studentName: 'Sarah Chen',
    action: 'Downloaded Course Materials',
    course: 'Data Science',
    timestamp: '4 hours ago',
    type: 'download',
  },
  {
    studentName: 'Michael Rodriguez',
    action: 'Completed Module 3',
    course: 'Web Development',
    timestamp: '6 hours ago',
    type: 'completion',
  },
  {
    studentName: 'Emma Thompson',
    action: 'Asked Question in Forum',
    course: 'Digital Marketing',
    timestamp: '8 hours ago',
    type: 'question',
  },
  {
    studentName: 'David Kim',
    action: 'Missed Assignment Deadline',
    course: 'Graphic Design',
    timestamp: '1 day ago',
    type: 'missed',
  },
];

const activityTypeStyles: Record<ActivityType, { dot: string }> = {
  assignment: { dot: 'bg-green-500' },
  discussion: { dot: 'bg-blue-500' },
  video: { dot: 'bg-purple-500' },
  quiz: { dot: 'bg-orange-500' },
  download: { dot: 'bg-gray-500' },
  completion: { dot: 'bg-teal-500' },
  question: { dot: 'bg-slate-500' },
  missed: { dot: 'bg-red-500' },
};

export function StudentActivityLog({
  data = placeholderData,
}: StudentActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Activity Log</CardTitle>
        <CardDescription>
          Detailed log of all student activities and interactions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              className="flex items-center justify-between rounded-lg border p-3"
              key={index}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    activityTypeStyles[item.type].dot
                  )}
                />
                <Avatar className="">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {getInitials(item.studentName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    <span className="font-semibold">{item.studentName}</span>{' '}
                    {item.action}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {item.course} • {item.timestamp}
                  </p>
                </div>
              </div>

              <Badge
                variant={item.type === 'missed' ? 'destructive' : 'outline'}
                className="capitalize"
              >
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentActivityLogSkeleton({
  data = placeholderData,
}: StudentActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-52" />
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

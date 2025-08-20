'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';
import { Eye, MessageSquare } from 'lucide-react';

interface StudentProgressData {
  name: string;
  timeSpent: string;
  progress: number;
  grade: string;
}

interface LessonStudentsTabProps {
  data?: StudentProgressData[];
}

const placeholderData: StudentProgressData[] = [
  { name: 'Sarah Johnson', timeSpent: '15m', progress: 100, grade: 'A' },
  { name: 'Mike Chen', timeSpent: '8m', progress: 65, grade: 'B+' },
  { name: 'Emma Davis', timeSpent: '12m', progress: 100, grade: 'A-' },
  { name: 'Alex Rodriguez', timeSpent: '4m', progress: 30, grade: 'N/A' },
];

function StudentProgressItem({ student }: { student: StudentProgressData }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{student.name}</p>
              <p className="text-muted-foreground text-sm">
                Time spent: {student.timeSpent}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex w-24 items-center gap-2">
              <Progress value={student.progress} className="h-2" />
              <span className="text-muted-foreground text-xs">
                {student.progress}%
              </span>
            </div>
            <Badge variant="secondary" className="w-10 justify-center">
              {student.grade}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentProgressItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="mt-1 h-4 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex w-24 items-center gap-2">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-6 w-10 rounded-md" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonStudentsTab({
  data = placeholderData,
}: LessonStudentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress</CardTitle>
        <CardDescription>
          Track individual student progress for this lesson
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((student) => (
          <StudentProgressItem key={student.name} student={student} />
        ))}
      </CardContent>
    </Card>
  );
}

export function LessonStudentsTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <StudentProgressItemSkeleton key={index} />
        ))}
      </CardContent>
    </Card>
  );
}

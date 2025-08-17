'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { getInitials } from '@/lib/utils';
import { Eye, MessageSquare } from 'lucide-react';

interface StudentData {
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'At Risk';
  progress: number;
  grade: string;
  timeSpent: string;
  certificates: number;
  enrolledCourses: string[];
}

interface StudentProfileCardProps {
  data?: StudentData;
}

const defaultStudentData: StudentData = {
  name: 'Sarah Chenasldjaklsdjklasjdklasjdklasjasdlakdjalsdkjaskldjdlkajsdkljaslkdjaslkd',
  email:
    'sarah.chen@email.c;laskdlkasdlkasjdkalsjdlkasjdklajskldjalskjdaslaskdkladlajsdlkasjdklasjom',
  avatarUrl:
    'https://lh3.googleusercontent.com/a/ACg8ocInTb5mB8bwKh6AZp07s13jdx2IOXumQSyjOPAKvWKsIvL4fLF3=s317-c-no',
  status: 'Inactive',
  progress: 92,
  grade: 'A',
  timeSpent: '45h 30m',
  certificates: 2,
  enrolledCourses: [
    'Data Science',
    'Machine Learning',
    'One more',
    'second one',
  ],
};

export function StudentProfileCard({
  data = defaultStudentData,
}: StudentProfileCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center justify-between">
        <div className="flex min-w-0 gap-3">
          <Avatar>
            <AvatarImage src={data.avatarUrl} />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{data.name}</CardTitle>
            <CardDescription className="truncate">{data.email}</CardDescription>
          </div>
        </div>

        <CardAction>
          <Badge
            variant={
              data.status === 'Active'
                ? 'default'
                : data.status === 'Inactive'
                  ? 'outline'
                  : 'destructive'
            }
          >
            {data.status}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-grow space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-1">
            <label className="text-muted-foreground text-sm">Progress</label>
            <div className="flex items-center gap-2">
              <Progress value={data.progress} className="h-2 flex-grow" />
              <span className="text-sm font-medium">{data.progress}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground text-sm">Grade</label>
            <p className="font-semibold">{data.grade}</p>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground text-sm">Time Spent</label>
            <p className="font-semibold">{data.timeSpent}</p>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground text-sm">
              Certificates
            </label>
            <p className="font-semibold">{data.certificates}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-sm">
            Enrolled Courses
          </label>
          <div className="flex flex-wrap gap-2">
            {data.enrolledCourses.map((course) => (
              <Badge key={course} variant="secondary">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function StudentProfileCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <CardAction>
            <Skeleton className="h-6 w-16 rounded-full" />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardFooter>
    </Card>
  );
}

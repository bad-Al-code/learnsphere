'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlarmClock, Award, LucideIcon, Play, Zap } from 'lucide-react';
import Image from 'next/image';

interface CourseProgress {
  title: string;
  instructor: string;
  imageUrl: string;
  progress: number;
  isDueSoon?: boolean;
}
interface MiniStat {
  title: string;
  value: string;
  icon: LucideIcon;
}
interface MyCoursesData {
  courses: CourseProgress[];
  stats: MiniStat[];
}

const placeholderData: MyCoursesData = {
  courses: [
    {
      title: 'React Fundamentals',
      instructor: 'Sarah Chen',
      imageUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
      progress: 75,
    },
    {
      title: 'Database Design',
      instructor: 'Mike Johnson',
      imageUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
      progress: 45,
      isDueSoon: true,
    },
    {
      title: 'UI/UX Principles',
      instructor: 'Emma Wilson',
      imageUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
      progress: 90,
    },
    {
      title: 'Python Programming',
      instructor: 'David Lee',
      imageUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
      progress: 30,
    },
  ],
  stats: [
    { title: 'Avg Grade', value: '87%', icon: Award },
    { title: 'Active Streak', value: '12 days', icon: Zap },
    { title: 'Due Soon', value: '3', icon: AlarmClock },
  ],
};

function CourseProgressCard({ course }: { course: CourseProgress }) {
  return (
    <Card className="bg-background flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={course.imageUrl}
            alt={course.title}
            width={40}
            height={40}
            className="rounded-md"
          />
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>by {course.instructor}</CardDescription>
            {course.isDueSoon && (
              <Badge variant="destructive" className="mt-1">
                Due Soon
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <Progress value={course.progress} />
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Play className="h-4 w-4" /> Resume Course
        </Button>
      </CardFooter>
    </Card>
  );
}

function MiniStatCard({ stat }: { stat: MiniStat }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs">{stat.title}</p>
        <div className="mt-2 flex items-center gap-2">
          <stat.icon className="h-5 w-5" />
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyCoursesTab() {
  const data = placeholderData;

  return (
    <Card className="">
      <CardHeader>
        <h2 className="text-2xl font-bold">Course Progress</h2>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.courses.map((course) => (
            <CourseProgressCard key={course.title} course={course} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {data.stats.map((stat) => (
            <MiniStatCard key={stat.title} stat={stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CourseProgressCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function MiniStatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-24" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-7 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MyCoursesTabSkeleton() {
  return (
    <div className="space-y-2">
      <div>
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <CourseProgressCardSkeleton />
        <CourseProgressCardSkeleton />
        <CourseProgressCardSkeleton />
        <CourseProgressCardSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <MiniStatCardSkeleton />
        <MiniStatCardSkeleton />
        <MiniStatCardSkeleton />
      </div>
    </div>
  );
}

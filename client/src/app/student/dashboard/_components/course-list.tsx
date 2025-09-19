'use client';

import { ImageOffIcon } from '@/components/shared/imge-off-icon';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
import {
  AlarmClock,
  Award,
  BookOpen,
  LucideIcon,
  Play,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useMyEnrolledCourses } from '../hooks/use-enrollments';
import { MyCourse } from '../schema/enrollment.schema';

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

const placeholderStats: MiniStat[] = [
  { title: 'Avg Grade', value: '87%', icon: Award },
  { title: 'Active Streak', value: '12 days', icon: Zap },
  { title: 'Due Soon', value: '3', icon: AlarmClock },
];
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

function CourseProgressCard({ enrollment }: { enrollment: MyCourse }) {
  const { course, progressPercentage } = enrollment;
  const instructorName =
    `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim() ||
    'Instructor N/A';

  return (
    <Card
      key={enrollment.enrollmentId}
      className="group hover:border-primary/30 border-border/50 flex cursor-pointer flex-col overflow-hidden pt-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <ImageOffIcon className="text-muted-foreground h-10 w-10" />
            </div>
          )}
        </AspectRatio>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        <div className="absolute right-3 bottom-3 left-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted/20 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>
      </div>

      <CardHeader className="space-y-2">
        <CardTitle className="text-foreground group-hover:text-primary line-clamp-2 text-base leading-tight font-semibold transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          by {instructorName}
        </CardDescription>
        <p className="text-muted-foreground text-xs">
          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent className="flex-grow space-y-2">
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} />
      </CardContent>

      <CardFooter>
        <Button className="w-full">
          <Play className="mr-2 h-4 w-4" /> Resume Course
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
  const { data: myCourses, isLoading, isError } = useMyEnrolledCourses();
  const stats = placeholderStats;

  if (isLoading) {
    return <MyCoursesTabSkeleton />;
  }
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Course Progress</h2>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Could not load your courses. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="">
      <CardHeader>
        <h2 className="text-2xl font-bold">Course Progress</h2>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {myCourses?.map((enrollment) => (
            <CourseProgressCard
              key={enrollment.enrollmentId}
              enrollment={enrollment}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {stats.map((stat) => (
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

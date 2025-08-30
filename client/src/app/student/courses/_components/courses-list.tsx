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
  Bookmark,
  Calendar,
  Clock,
  Heart,
  PlayCircle,
  Star,
} from 'lucide-react';
import Image from 'next/image';

type TCourse = {
  id: string;
  title: string;
  instructor: string;
  iconUrl: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  dueDate: string;
  progress: number;
  currentModule: string;
};

const coursesData: TCourse[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    instructor: 'Sarah Chen',
    iconUrl: 'https://picsum.photos/seed/react/100/100',
    rating: 4.8,
    difficulty: 'Intermediate',
    duration: '6 weeks',
    dueDate: '2024-01-10',
    progress: 75,
    currentModule: 'Module 8: Advanced Hooks (9 of 12 modules)',
  },
  {
    id: '2',
    title: 'Database Design',
    instructor: 'Mike Johnson',
    iconUrl: 'https://picsum.photos/seed/database/100/100',
    rating: 4.6,
    difficulty: 'Advanced',
    duration: '8 weeks',
    dueDate: '2024-01-09',
    progress: 45,
    currentModule: 'Module 4: Normalization (5 of 10 modules)',
  },
  {
    id: '3',
    title: 'UI/UX Principles',
    instructor: 'Emma Wilson',
    iconUrl: 'https://picsum.photos/seed/uiux/100/100',
    rating: 4.9,
    difficulty: 'Beginner',
    duration: '4 weeks',
    dueDate: '2024-01-11',
    progress: 90,
    currentModule: 'Module 9: Prototyping (9 of 10 modules)',
  },
  {
    id: '4',
    title: 'Python Programming',
    instructor: 'David Lee',
    iconUrl: 'https://picsum.photos/seed/python/100/100',
    rating: 4.7,
    difficulty: 'Intermediate',
    duration: '10 weeks',
    dueDate: '2024-01-08',
    progress: 30,
    currentModule: 'Module 3: Data Structures (5 of 14 modules)',
  },
];

export function CourseCard({ course }: { course: TCourse }) {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-muted flex-shrink-0 rounded-md">
            <Image
              src={course.iconUrl}
              alt={`${course.title}`}
              className="rounded-md shadow-lg"
              width={100}
              height={100}
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <CardTitle>{course.title}</CardTitle>
              <div className="flex items-center justify-center gap-1 font-semibold">
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              by {course.instructor}
            </p>

            <CardDescription className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <Badge
                variant="outline"
                className={cn(
                  course.difficulty === 'Beginner' &&
                    'border-green-500 text-green-500',
                  course.difficulty === 'Intermediate' &&
                    'border-yellow-500 text-yellow-500',
                  course.difficulty === 'Advanced' &&
                    'border-red-500 bg-red-500/10 text-red-500'
                )}
              >
                {course.difficulty}
              </Badge>
              <Badge
                variant="secondary"
                className="hidden items-center gap-1 sm:flex"
              >
                <Clock className="h-3 w-3" />
                {course.duration}
              </Badge>
              <Badge
                variant="secondary"
                className="hidden items-center gap-1 sm:flex"
              >
                <Calendar className="h-3 w-3" />
                {course.dueDate}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <h4 className="text-sm font-semibold">Progress</h4>
            <span className="text-primary text-sm font-semibold">
              {course.progress}% Complete
            </span>
          </div>
          <Progress value={course.progress} className="h-2" />
          <p className="text-muted-foreground mt-2 text-xs">
            {course.currentModule}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex-1">
            <PlayCircle className="mr-2 h-4 w-4" />
            Continue
          </Button>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorite</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bookmark</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseList() {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {coursesData.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Skeleton className="h-[100px] w-[100px] rounded-md" />

          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-10 rounded-md" />
            </div>

            <Skeleton className="h-4 w-28" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="hidden h-5 w-12 sm:block" />
              <Skeleton className="hidden h-5 w-12 sm:block" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="mt-2 h-3 w-3/4" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseListSkeleton() {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

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
import { ErrorState } from '@/components/ui/error-state';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  PlayCircle,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useMyEnrollments } from '../hooks';
import { EnrolledCourse } from '../schema';
import { useEnrolledCoursesStore } from '../store';

function CoursePagination() {
  const { page, setPage, limit, setLimit } = useEnrolledCoursesStore();
  const { data } = useMyEnrollments();

  const totalPages = data?.pagination?.totalPages ?? 0;
  const totalResults = data?.pagination?.totalResults ?? 0;

  if (totalResults <= limit) return null;

  return (
    <div className="flex items-center justify-center space-x-6 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${limit}`}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent side="top">
            {[6, 10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setPage(1)}
          disabled={page <= 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => setPage(totalPages)}
          disabled={page >= totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function CourseCard({
  course: enrolledCourse,
}: {
  course: EnrolledCourse;
}) {
  const { course } = enrolledCourse;

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-muted flex-shrink-0 rounded-md">
            <Image
              src={course.imageUrl || '/images/placeholder.svg'}
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
                  <span>{course.rating || 'N/A'}</span>
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              by {course.instructor?.firstName} {course.instructor?.lastName}
            </p>

            <CardDescription className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <Badge
                variant="outline"
                className={cn(
                  course.level === 'beginner' &&
                    'border-green-500 text-green-500',
                  course.level === 'intermediate' &&
                    'border-yellow-500 text-yellow-500',
                  course.level === 'advanced' &&
                    'border-red-500 bg-red-500/10 text-red-500'
                )}
              >
                {course.level}
              </Badge>
              {/* <Badge variant="secondary" className="hidden items-center gap-1 sm:flex">
                <Clock className="h-3 w-3" />
                {Math.round((course.duration || 0) / 60)} hours
              </Badge> */}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <h4 className="text-sm font-semibold">Progress</h4>
            <span className="text-primary text-sm font-semibold">
              {Number(enrolledCourse.progressPercentage || 0).toFixed(0)}%
              Complete
            </span>
          </div>
          <Progress value={enrolledCourse.progressPercentage} className="h-2" />
          <p className="text-muted-foreground mt-2 text-xs">
            {enrolledCourse.currentModule}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex-1">
            <PlayCircle className="h-4 w-4" />
            Continue
          </Button>
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
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseList() {
  const { data, isLoading, isError, error, refetch } = useMyEnrollments();

  if (isLoading) {
    return <CourseListSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center">
          <p className="text-lg font-semibold">No Courses Found</p>
          <p className="text-muted-foreground text-sm">
            Try adjusting your filters or enroll in a new course!
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data.results.map((enrollment) => (
          <CourseCard key={enrollment.id} course={enrollment} />
        ))}
      </div>
      <CoursePagination />
    </div>
  );
}

// ... Skeletons

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

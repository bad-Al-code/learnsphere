'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';
import { useCourseRecommendations } from '../hooks';
import { RecommendedCourse } from '../schema';

export function RecommendedCourseCard({
  course,
}: {
  course: RecommendedCourse;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <div className="bg-muted flex aspect-video w-full items-center justify-center">
        <img
          src={course.imageUrl || '/images/placeholder.svg'}
          alt={course.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>

      <CardContent className="flex flex-grow flex-col space-y-2 pt-4">
        <div className="flex-grow space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{course.title}</h3>
              <p className="text-muted-foreground text-sm">
                by an Expert Instructor
              </p>
            </div>

            <div className="flex items-center font-semibold">
              <Button variant="outline" size="sm">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-center">{course.rating || 'N/A'}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
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
            <Badge variant="secondary">
              {course.duration}{' '}
              {course.duration && course.duration > 1 ? 'hours' : 'hour'}
            </Badge>
          </div>
          <div className="text-muted-foreground bg-muted/50 mt-2 rounded-md border p-2 text-xs">
            {course.reason}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-2xl font-bold">
          {course.price ? `$${parseFloat(course.price).toFixed(0)}` : 'Free'}
        </p>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Favorite</p>
            </TooltipContent>
          </Tooltip>
          <Button>Enroll Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function RecommendationsSection() {
  const { data, isLoading, isError, error, refetch } =
    useCourseRecommendations();

  if (isLoading) {
    return <RecommendationsSectionSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!data || data.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <p className="text-lg font-semibold">No Recommendations Yet</p>
            <p className="text-muted-foreground text-sm">
              Complete more courses to receive personalized AI recommendations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <p className="text-muted-foreground">
          AI-powered course suggestions based on your learning history
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {data.map((course) => (
          <RecommendedCourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

export function RecommendedCourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full rounded-b-none" />
      <CardContent className="flex flex-grow flex-col">
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-10" />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Skeleton className="h-8 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
}

function RecommendationsSectionSkeleton() {
  return (
    <section>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 mb-6 h-4 w-80" />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <RecommendedCourseCardSkeleton />
        <RecommendedCourseCardSkeleton />
        <RecommendedCourseCardSkeleton />
      </div>
    </section>
  );
}

export function RecommendedTab() {
  return (
    <div className="space-x-2">
      <RecommendationsSection />
    </div>
  );
}

export function RecommendedTabSkeleton() {
  return (
    <div className="">
      <RecommendationsSectionSkeleton />
    </div>
  );
}

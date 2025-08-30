'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';

type TRecommendedCourse = {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  reason: string;
  price: number;
};

const recommendedCoursesData: TRecommendedCourse[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    instructor: 'Sarah Chen',
    imageUrl: 'https://picsum.photos/seed/react/400/250',
    rating: 4.9,
    difficulty: 'Advanced',
    duration: '8 weeks',
    reason: 'Because you completed React Fundamentals',
    price: 89,
  },
  {
    id: '2',
    title: 'Node.js Backend Development',
    instructor: 'Michael Brown',
    imageUrl: 'https://picsum.photos/seed/node/400/250',
    rating: 4.7,
    difficulty: 'Intermediate',
    duration: '6 weeks',
    reason: 'Perfect next step for full-stack development',
    price: 79,
  },
  {
    id: '3',
    title: 'TypeScript Mastery',
    instructor: 'Jennifer Kim',
    imageUrl: 'https://picsum.photos/seed/ts/400/250',
    rating: 4.8,
    difficulty: 'Intermediate',
    duration: '5 weeks',
    reason: 'Enhance your JavaScript skills',
    price: 69,
  },
];

export function RecommendedCourseCard({
  course,
}: {
  course: TRecommendedCourse;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <div className="bg-muted flex aspect-video w-full items-center justify-center">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>

      <CardContent className="space-y-2">
        <div className="flex-grow space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{course.title}</h3>
              <p className="text-muted-foreground text-sm">
                by {course.instructor}
              </p>
            </div>

            <div className="flex items-center font-semibold">
              <Button variant="outline">
                <Star className="fill-yellow-400 text-yellow-400" />
                <span className="text-center">{course.rating}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge
              className={cn(
                course.difficulty === 'Advanced' &&
                  'border-red-500/20 bg-red-500/10 text-red-500'
              )}
            >
              {course.difficulty}
            </Badge>
            <Badge variant="secondary">{course.duration}</Badge>
          </div>
          <div className="text-muted-foreground bg-muted/50 mt-2 rounded-md border p-2 text-xs">
            {course.reason}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-2xl font-bold">${course.price}</p>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
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
          </TooltipProvider>
          <Button>Enroll Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function RecommendationsSection() {
  return (
    <section className="space-y-0">
      <h2 className="text-2xl font-bold">Recommended for You</h2>
      <p className="text-muted-foreground mb-2">
        AI-powered course suggestions based on your learning history
      </p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {recommendedCoursesData.map((course) => (
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

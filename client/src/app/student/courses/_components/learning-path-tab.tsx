'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  FileText,
  Map,
  Star,
} from 'lucide-react';

type TPrerequisite = { text: string; completed: boolean };
type TCoursePrereqs = {
  id: string;
  courseName: string;
  required: TPrerequisite[];
  recommended: TPrerequisite[];
};
type TPathStep = {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Locked';
  courses: string[];
};
type TReview = {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  content: string;
  course: string;
  helpfulCount: number;
};

const prereqsData: TCoursePrereqs[] = [
  {
    id: '1',
    courseName: 'React Fundamentals',
    required: [
      { text: 'JavaScript Essentials', completed: true },
      { text: 'HTML & CSS Fundamentals', completed: true },
    ],
    recommended: [
      { text: 'ES6+ Features', completed: false },
      { text: 'Web Development Basics', completed: false },
    ],
  },
  {
    id: '2',
    courseName: 'Database Design',
    required: [{ text: 'SQL Basics', completed: true }],
    recommended: [
      { text: 'Data Structures', completed: false },
      { text: 'System Design Basics', completed: false },
    ],
  },
];
const learningPathData: TPathStep[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    status: 'Completed',
    courses: ['HTML & CSS Fundamentals', 'JavaScript Essentials'],
  },
  {
    id: '2',
    title: 'Frontend Specialization',
    status: 'In Progress',
    courses: ['React Fundamentals', 'UI/UX Principles'],
  },
  {
    id: '3',
    title: 'Full-Stack Development',
    status: 'Locked',
    courses: ['Database Design', 'Node.js Backend', 'API Development'],
  },
  {
    id: '4',
    title: 'Advanced Topics',
    status: 'Locked',
    courses: ['System Design', 'DevOps Basics', 'Testing Strategies'],
  },
];
const reviewsData: TReview[] = [
  {
    id: '1',
    author: 'Alex Smith',
    initials: 'AS',
    rating: 5,
    date: '2024-01-10',
    content:
      "Excellent course! Sarah's teaching style is very clear and the hands-on projects really helped solidify the concepts.",
    course: 'React Fundamentals',
    helpfulCount: 12,
  },
  {
    id: '2',
    author: 'Emma Wilson',
    initials: 'EW',
    rating: 4,
    date: '2024-01-08',
    content:
      'Great content and well-structured. Would love to see more advanced patterns covered in future modules.',
    course: 'React Fundamentals',
    helpfulCount: 8,
  },
  {
    id: '3',
    author: 'Mike Johnson',
    initials: 'MJ',
    rating: 5,
    date: '2024-01-05',
    content:
      'Perfect balance of theory and practical examples. The normalization exercises were particularly valuable.',
    course: 'Database Design',
    helpfulCount: 15,
  },
];

export function PrerequisiteItem({
  prereq,
  isRecommended = false,
}: {
  prereq: TPrerequisite;
  isRecommended?: boolean;
}) {
  const Icon = isRecommended ? AlertCircle : CheckCircle2;
  const color = isRecommended
    ? 'text-yellow-500'
    : prereq.completed
      ? 'text-green-500'
      : 'text-red-500';
  return (
    <li className={cn('flex items-center gap-2 text-sm', color)}>
      <Icon className="h-4 w-4" />
      {prereq.text}
    </li>
  );
}

function PrerequisitesTracker() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <CardTitle>Prerequisites Tracker</CardTitle>
        </div>
        <CardDescription>
          Track required and recommended courses for your current enrollment
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {prereqsData.map((course) => (
          <div key={course.id}>
            <h3 className="mb-2 font-semibold">{course.courseName}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-red-500">
                  Required Prerequisites
                </h4>
                <ul className="space-y-1">
                  {course.required.map((p) => (
                    <PrerequisiteItem key={p.text} prereq={p} />
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-yellow-500">
                  Recommended Prerequisites
                </h4>
                <ul className="space-y-1">
                  {course.recommended.map((p) => (
                    <PrerequisiteItem key={p.text} prereq={p} isRecommended />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LearningPathStep({
  step,
  isLast,
}: {
  step: TPathStep;
  isLast: boolean;
}) {
  const statusIcon = () => {
    const baseClass =
      'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0';
    switch (step.status) {
      case 'Completed':
        return (
          <div className={cn(baseClass, 'bg-green-500/20 text-green-500')}>
            <CheckCircle2 className="h-5 w-5" />
          </div>
        );
      case 'In Progress':
        return (
          <div className={cn(baseClass, 'bg-primary/20 text-primary')}>
            <CircleDot className="h-5 w-5 animate-pulse" />
          </div>
        );
      case 'Locked':
        return (
          <div className={cn(baseClass, 'bg-muted text-muted-foreground')}>
            {learningPathData.indexOf(step) + 1}
          </div>
        );
    }
  };
  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center">
        {statusIcon()}
        {!isLast && <div className="bg-border mt-2 h-full w-px" />}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{step.title}</h3>
          <Badge variant={step.status === 'Locked' ? 'outline' : 'default'}>
            {step.status}
          </Badge>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {step.courses.map((course) => (
            <Badge key={course} variant="secondary">
              {course}
            </Badge>
          ))}
        </div>
        {step.status === 'Locked' && (
          <p className="text-muted-foreground mt-2 text-xs">
            Complete previous level to unlock
          </p>
        )}
      </div>
    </div>
  );
}

export function LearningPathVisualization() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          <CardTitle>Learning Path Visualization</CardTitle>
        </div>
        <CardDescription>
          Your progression through skill levels and specializations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {learningPathData.map((step, index) => (
          <LearningPathStep
            key={step.id}
            step={step}
            isLast={index === learningPathData.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          )}
        />
      ))}
    </div>
  );
}

function ReviewItem({ review }: { review: TReview }) {
  return (
    <div className="flex items-start gap-4 rounded-md border p-3">
      <Avatar>
        <AvatarFallback>{review.initials}</AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{review.author}</span>
            <StarRating rating={review.rating} />
          </div>
          <span className="text-muted-foreground text-xs">{review.date}</span>
        </div>

        <p className="my-1 text-sm">{review.content}</p>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <FileText className="h-3 w-3" />
          <span>
            {review.course} • {review.helpfulCount} found this helpful
          </span>
        </div>
      </div>
    </div>
  );
}

export function CourseReviews() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          <CardTitle>Course Reviews</CardTitle>
        </div>
        <CardDescription>
          See what other students are saying about your courses
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-border space-y-1">
        {reviewsData.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </CardContent>
    </Card>
  );
}

export function PrerequisitesTrackerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-2 h-5 w-32" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LearningPathStepSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        {!isLast && <div className="bg-border mt-2 h-full w-px" />}
      </div>
      <div className="w-full pb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="mt-2 flex gap-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="mt-2 h-3 w-48" />
      </div>
    </div>
  );
}

function LearningPathVisualizationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 4 }).map((_, i) => (
          <LearningPathStepSkeleton key={i} isLast={i === 3} />
        ))}
      </CardContent>
    </Card>
  );
}

function ReviewItemSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-md border p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

function CourseReviewsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>
      <CardContent className="divide-border space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReviewItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}

export function LearningPathTab() {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Study Groups</h2>
        <p className="text-muted-foreground">
          Join collaborative learning sessions with your peers
        </p>
      </div>
      <PrerequisitesTracker />
      <LearningPathVisualization />
      <CourseReviews />
    </div>
  );
}

export function LearningPathTabSkeleton() {
  return (
    <div className="space-y-2">
      <div>
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <PrerequisitesTrackerSkeleton />
      <LearningPathVisualizationSkeleton />
      <CourseReviewsSkeleton />
    </div>
  );
}

'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Clock, FileText, LucideIcon, Star, Trophy } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ComparisonTab, ComparisonTabSkeleton } from './comparison-tab';

const gradeDistributionData = [
  { grade: 'A+', count: 12 },
  { grade: 'A', count: 15.5 },
  { grade: 'A-', count: 8 },
  { grade: 'B+', count: 3.5 },
  { grade: 'B', count: 2 },
];

const gradeChartConfig: ChartConfig = {
  count: {
    label: 'Count',
    color: 'var(--primary)',
  },
};

const timeAllocationData = [
  { activity: 'Video Lectures', value: 40, fill: 'var(--color-lectures)' },
  { activity: 'Assignments', value: 30, fill: 'var(--color-assignments)' },
  { activity: 'Reading', value: 20, fill: 'var(--color-reading)' },
  { activity: 'Discussion', value: 10, fill: 'var(--color-discussion)' },
];

const timeChartConfig: ChartConfig = {
  value: {
    label: 'Time (in %)',
  },
  lectures: {
    label: 'Video Lectures',
    color: 'hsl(221.2 83.2% 53.3%)',
  },
  assignments: {
    label: 'Assignments',
    color: 'hsl(142.1 76.2% 36.3%)',
  },
  reading: {
    label: 'Reading',
    color: 'hsl(34.9 87.5% 55.3%)',
  },
  discussion: {
    label: 'Discussion',
    color: 'hsl(0 72.2% 50.6%)',
  },
};

export function AssignmentGradeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Grade Distribution</CardTitle>
        <CardDescription>
          Your grade breakdown across all assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={gradeChartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={gradeDistributionData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="grade"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              ticks={[0, 4, 8, 12, 16]}
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Bar dataKey="count" fill="var(--primary)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TimeAllocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Allocation</CardTitle>
        <CardDescription>How you spend your study time</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={timeChartConfig}
          className="mx-auto aspect-square h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={timeAllocationData}
              dataKey="value"
              nameKey="activity"
              innerRadius={0}
              strokeWidth={2}
              labelLine={true}
              label={({ payload, ...props }) => {
                return (
                  <text {...props} className="fill-muted-foreground text-xs">
                    {`${payload.activity}: ${payload.value}%`}
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type TStat = {
  title: string;
  value: string;
  description: string;
  Icon: LucideIcon;
};

const statsData: TStat[] = [
  {
    title: 'Courses Completed',
    value: '3',
    description: 'This year',
    Icon: Trophy,
  },
  {
    title: 'Total Hours',
    value: '100',
    description: 'Study time',
    Icon: Clock,
  },
  {
    title: 'Average Grade',
    value: 'A',
    description: 'Excellent performance',
    Icon: Star,
  },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.Icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

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

export function AnalyticsTab() {
  return (
    <div className="space-y-2">
      <StatsCards />

      <div>
        <h2 className="text-2xl font-bold">Course Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights into your learning performance
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <AssignmentGradeDistribution />
        <TimeAllocation />
      </div>

      <ComparisonTab />
      <CourseReviews />
    </div>
  );
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="space-y-2">
      <StatsCardsSkeleton />

      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>

      <ComparisonTabSkeleton />
      <CourseReviewsSkeleton />
    </div>
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

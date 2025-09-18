'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function IntegrationCardSkeleton() {
  return (
    <Card className="flex h-full animate-pulse flex-col">
      <CardHeader className="">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <Skeleton className="h-6 w-20" />
      </CardContent>

      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-9 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function CategorySectionSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <IntegrationCardSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AllTabSkeleton() {
  return (
    <div className="animate-in fade-in-0 space-y-6 duration-500">
      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CategorySectionSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

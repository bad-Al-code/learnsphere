'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function IntegrationCardSkeleton() {
  return (
    <Card className="group relative animate-pulse overflow-hidden">
      <CardHeader className="">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

function CategorySectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <IntegrationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function AvailableTabSkeleton() {
  return (
    <div className="animate-in fade-in-0 space-y-6 duration-500">
      <HeaderSkeleton />

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CategorySectionSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

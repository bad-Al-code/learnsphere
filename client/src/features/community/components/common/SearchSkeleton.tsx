'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SearchSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md p-2">
      <Skeleton className="h-10 w-10 rounded-full" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export function CategoryListSkeleton() {
  return (
    <div className="mb-8 flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-md" />
      ))}
    </div>
  );
}

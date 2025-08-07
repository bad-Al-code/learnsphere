import { Skeleton } from "@/components/ui/skeleton";

export function ModulesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-[52px] w-full rounded-md" />
      </div>
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-[52px] w-full rounded-md" />
      </div>

      <div className="mt-6 border rounded-md p-4">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseHeaderSkeleton() {
  return (
    <div className="bg-card border-b p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Skeleton className="h-2 flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function ModuleSidebarSkeleton() {
  return (
    <div className="h-full space-y-4 p-4">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <div className="ml-4 space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-10 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LessonViewerSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Card className="overflow-hidden">
        <Skeleton className="aspect-video w-full" />
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />

        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <Card className="space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
      </Card>

      <Card className="space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>

      <Skeleton className="h-12 w-48" />
    </div>
  );
}

export function AIChatSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
        >
          <Skeleton className="h-16 w-3/4 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="space-y-4 p-6">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ))}

      <Skeleton className="h-12 w-32" />
    </div>
  );
}

export function AssignmentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <Card className="space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { getCourseForEditor } from '../../actions';
import {
  ContentTabHeader,
  ContentTabHeaderSkeleton,
  ModuleItemSkeleton,
  ModulesList,
} from './module-list';

export async function ContentTab({ courseId }: { courseId: string }) {
  const result = await getCourseForEditor(courseId);
  if (!result.success || !result.data) {
    notFound();
  }
  const course = result.data;

  return (
    <div className="space-y-2">
      <ContentTabHeader courseId={courseId} />

      <Card>
        <CardHeader>
          <CardTitle>{course.title} - Course Structure</CardTitle>
          <CardDescription>
            Organize your course content into modules and lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModulesList initialModules={course.modules} courseId={courseId} />
        </CardContent>
      </Card>
    </div>
  );
}

export function ContentTabSkeleton() {
  return (
    <div className="space-y-6">
      <ContentTabHeaderSkeleton />
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-72" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ModuleItemSkeleton />
          <ModuleItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

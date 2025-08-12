import { getCourseDetails } from '@/app/courses/actions';
import { Banner } from '@/components/shared/banner';
import { IconBadge } from '@/components/shared/icon-badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ListChecks } from 'lucide-react';
import { notFound } from 'next/navigation';
import { CourseActions } from './_components/course-actions';

export default async function CourseSettingsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    notFound();
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.modules.some((module: any) => module.lessons.length > 0),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="space-y-6">
      {course.status === 'draft' && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible to students."
        />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
            <div>
              <CardTitle>Course Setup</CardTitle>
              <CardDescription>
                Complete all fields ({completedFields}/{totalFields})
              </CardDescription>
            </div>
          </div>
          <CourseActions
            courseId={course.id}
            isPublished={course.status === 'published'}
            disabled={!isComplete}
          />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You can publish your course once all required fields are complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton loader for settings page
export function CourseSettingsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-12 w-full" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-1 h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-64" />
        </CardContent>
      </Card>
    </div>
  );
}

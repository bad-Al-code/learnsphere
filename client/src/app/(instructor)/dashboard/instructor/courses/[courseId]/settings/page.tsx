import { getCourseDetails } from '@/app/courses/actions';
import { Banner } from '@/components/shared/banner';
import { IconBadge } from '@/components/shared/icon-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, ListChecks } from 'lucide-react';
import Link from 'next/link';
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

  const fieldLabels = [
    { value: course.title, label: 'Course Title' },
    { value: course.description, label: 'Description' },
    { value: course.imageUrl, label: 'Course Image' },
    { value: course.price, label: 'Price' },
    { value: course.categoryId, label: 'Category' },
    {
      value: course.modules.some((module: any) => module.lessons.length > 0),
      label: 'At least one lesson in a module',
    },
  ];

  const totalFields = fieldLabels.length;
  const completedFields = fieldLabels.filter((f) => Boolean(f.value)).length;
  const isComplete = completedFields === totalFields;

  const missingFields = fieldLabels.filter((f) => !f.value).map((f) => f.label);

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
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            You can publish your course once all required fields are complete.
          </p>

          {!isComplete && (
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm font-medium">
                  Required fields missing:
                </p>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  {missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              </div>

              <Button asChild variant="outline" className="font-medium">
                <Link
                  href={`/dashboard/instructor/courses/${course.id}/overview`}
                  className="text-primary flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go to Overview to Update
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

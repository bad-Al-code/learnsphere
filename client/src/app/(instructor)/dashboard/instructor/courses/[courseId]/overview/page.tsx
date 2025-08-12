import { getCategories } from '@/app/(admin)/actions';
import { getCourseDetails } from '@/app/courses/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DetailsForm } from './_components/detail-form';
import { ThumbnailUploader } from './_components/thumbnail-uploader';

function CourseDetailsEditorSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

async function CourseDetailsEditor({ courseId }: { courseId: string }) {
  const course = await getCourseDetails(courseId);
  const categoriesResult = await getCategories();

  if (!course) {
    notFound();
  }

  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Course</CardTitle>
          <CardDescription>
            Update the course title, category, and other details here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DetailsForm
            initialData={course}
            courseId={course.id}
            categories={categories.map((c: { name: string; id: string }) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Thumbnail</CardTitle>
          <CardDescription>
            Upload or replace the course thumbnail image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThumbnailUploader
            courseId={course.id}
            currentImageUrl={course.imageUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function CourseDetailsEditorPage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<CourseDetailsEditorSkeleton />}>
      <CourseDetailsEditor courseId={params.courseId} />
    </Suspense>
  );
}

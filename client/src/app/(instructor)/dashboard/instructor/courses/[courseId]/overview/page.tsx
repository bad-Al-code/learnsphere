import { getCategories } from '@/app/(admin)/actions';
import { getCourseDetails } from '@/app/courses/actions';
import { IconBadge } from '@/components/shared/icon-badge';
import { LayoutDashboard } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DetailsForm } from './_components/detail-form';

export default async function CourseDetailsEditorPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseDetails(params.courseId);
  const categoriesResult = await getCategories();

  if (!course) {
    notFound();
  }

  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <div className="flex items-center gap-x-2">
          <IconBadge icon={LayoutDashboard} />
          <h2 className="text-xl">Customize Your Course</h2>
        </div>
        <DetailsForm
          initialData={course}
          courseId={course.id}
          categories={categories.map((c: { name: any; id: any }) => ({
            label: c.name,
            value: c.id,
          }))}
        />
      </div>
      <div>
        <p>Thumbnail editor placeholder</p>
      </div>
    </div>
  );
}

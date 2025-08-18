import { redirect } from 'next/navigation';

export default function CourseIdPage({
  params,
}: {
  params: { courseId: string };
}) {
  redirect(`/dashboard/courses/${params.courseId}/overview`);
}

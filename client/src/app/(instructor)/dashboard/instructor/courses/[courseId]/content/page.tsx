import { getCourseDetails } from "@/app/courses/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function CourseContentPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Modules and lessons for "{course.title}" will be managed here.</p>
      </CardContent>
    </Card>
  );
}

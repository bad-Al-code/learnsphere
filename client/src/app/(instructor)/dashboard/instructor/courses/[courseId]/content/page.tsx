import { getCourseDetails } from "@/app/courses/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { AddModuleForm } from "./_components/add-module-form";
import { ModulesList } from "./_components/module-list";

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
        <CardDescription>
          Drag and drop modules to reorder them. Click on a module to manage its
          lessons.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ModulesList initialModules={course.modules} courseId={course.id} />
        <div className="mt-6">
          <AddModuleForm courseId={course.id} />
        </div>
      </CardContent>
    </Card>
  );
}

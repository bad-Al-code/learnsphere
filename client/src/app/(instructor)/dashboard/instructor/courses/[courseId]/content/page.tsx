import { getCourseDetails } from "@/app/courses/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddModuleForm } from "./_components/add-module-form";
import { ModulesList } from "./_components/module-list";
import { ModulesSkeleton } from "./_components/module-skeleton";

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
        <Suspense fallback={<ModulesSkeleton />}>
          <CourseModules courseId={params.courseId} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function CourseModules({ courseId }: { courseId: string }) {
  const course = await getCourseDetails(courseId);

  if (!course) {
    return <p>Course data could not be loaded.</p>;
  }

  return (
    <div>
      <AddModuleForm courseId={course.id} />
      <ModulesList modules={course.modules} courseId={course.id} />
    </div>
  );
}

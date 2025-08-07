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
      <ModulesList modules={course.modules} courseId={course.id} />
      <AddModuleForm courseId={course.id} />
    </div>
  );
}

function ModulesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2  h-[52px] rounded-md animate-pulse"></div>
      <div className="flex items-center gap-x-2  h-[52px] rounded-md animate-pulse"></div>
      <div className="mt-6 border  rounded-md p-4 animate-pulse">
        <div className="h-10 w-full rounded-md"></div>
      </div>
    </div>
  );
}

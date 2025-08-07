import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/app/(auth)/actions";
import { getCourseDetails } from "@/app/courses/actions";
import { CourseSidebar } from "./_components/course-sidebar";

export default async function CourseEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = params;
  const [user, course] = await Promise.all([
    getCurrentUser(),
    getCourseDetails(courseId),
  ]);

  if (
    !user ||
    !course ||
    (user.userId !== course.instructorId && user.role !== "admin")
  ) {
    redirect("/dashboard/instructor/courses");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b h-16 flex items-center">
        <div className="flex items-center text-sm">
          <Link
            href="/dashboard/instructor/courses"
            className="hover:underline"
          >
            My Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-semibold truncate">{course.title}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r h-full p-4">
          <CourseSidebar courseId={course.id} />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

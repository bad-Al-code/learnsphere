import { getCourseDetails } from "@/app/courses/actions";
import { redirect } from "next/navigation";
import { CourseSidebar } from "../../_components/course-sidebar";
import { checkEnrollmentStatus } from "../../actions";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = params;

  const enrollment = await checkEnrollmentStatus(courseId);
  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  const course = await getCourseDetails(courseId);
  if (!course) {
    redirect("/");
  }

  return (
    <div className="h-full flex">
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} />
      </div>
      <main className="md:pl-80 h-full w-full">{children}</main>
    </div>
  );
}

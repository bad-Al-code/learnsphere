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
    <div className="container mx-auto flex h-full ">
      <div className="hidden md:flex w-80 flex-col h-full  fixed   ">
        <CourseSidebar course={course} />
      </div>
      <main className="md:pl-80 w-full">{children}</main>
    </div>
  );
}

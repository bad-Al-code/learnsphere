import { getPublicCourses } from "../actions";
import { CourseCard } from "./course-card";
import { PaginationControls } from "./pagination-controls";

interface CoursesListProps {
  searchParams?: { page?: string; level?: string };
}

export async function CoursesList({ searchParams }: CoursesListProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const level = searchParams?.level;

  const { results: courses, pagination } = await getPublicCourses({
    page: currentPage,
    level,
  });

  if (courses.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No courses found.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <PaginationControls totalPages={pagination.totalPages} />
    </>
  );
}

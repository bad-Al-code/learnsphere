import { getCategoryBySlug, getPublicCourses } from '../actions';
import { CourseCard } from './course-card';
import { PaginationControls } from './pagination-controls';

interface CoursesListProps {
  searchParams?: { page?: string; level?: string; category?: string };
}

export async function CoursesList({ searchParams }: CoursesListProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const level = searchParams?.level;
  const categorySlug = searchParams?.category;

  let categoryId: string | undefined = undefined;

  if (categorySlug) {
    const category = await getCategoryBySlug(categorySlug);
    if (category) {
      categoryId = category.id;
    } else {
      return (
        <p className="text-muted-foreground text-center">Category not found.</p>
      );
    }
  }

  const { results: courses, pagination } = await getPublicCourses({
    page: currentPage,
    level,
    categoryId,
  });

  if (courses.length === 0) {
    return (
      <p className="text-muted-foreground text-center">No courses found.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <PaginationControls totalPages={pagination.totalPages} />
    </>
  );
}

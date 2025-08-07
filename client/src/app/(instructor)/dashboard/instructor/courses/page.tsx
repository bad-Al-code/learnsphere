import { getCategories } from "@/app/(admin)/actions";
import { PaginationControls } from "@/app/courses/_components/pagination-controls";
import { Suspense } from "react";
import { getMyCourses } from "../../../actions";
import { CourseFilters } from "./_components/course-filters";
import { CoursesGridSkeleton } from "./_components/course-grid-skeleton";
import { MyCoursesGrid } from "./_components/my-courses-grid";

interface MyCoursesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MyCoursesPage({
  searchParams,
}: MyCoursesPageProps) {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            Manage and create your learning content.
          </p>
        </div>
      </div>

      <CourseFilters categories={categories.success ? categories.data : []} />

      <Suspense fallback={<CoursesGridSkeleton />}>
        <CoursesDataComponent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CoursesDataComponent({ searchParams }: MyCoursesPageProps) {
  const options = {
    query: typeof searchParams.q === "string" ? searchParams.q : undefined,
    categoryId:
      typeof searchParams.categoryId === "string"
        ? searchParams.categoryId
        : undefined,
    level:
      typeof searchParams.level === "string" ? searchParams.level : undefined,
    price:
      typeof searchParams.price === "string"
        ? (searchParams.price as any)
        : undefined,
    duration:
      typeof searchParams.duration === "string"
        ? searchParams.duration
        : undefined,
    sortBy:
      typeof searchParams.sortBy === "string"
        ? (searchParams.sortBy as any)
        : undefined,
    page: Number(searchParams.page) || 1,
  };

  const { results, pagination } = await getMyCourses(options);

  return (
    <>
      <MyCoursesGrid courses={results} />
      <PaginationControls totalPages={pagination.totalPages} />
    </>
  );
}

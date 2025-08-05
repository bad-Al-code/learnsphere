import { Suspense } from "react";
import { CategoryList } from "./_components/category-list";
import { CoursesSkeleton } from "./_components/course-skeleton";
import { CategoryListSkeleton } from "./_components/courselist-skeleton";
import { CoursesList } from "./_components/courses-lists";
import { getCategoryOptions } from "./actions";

interface CoursesPageProps {
  searchParams?: { page?: string };
}

export default async function CoursePage({ searchParams }: CoursesPageProps) {
  const categories = await getCategoryOptions();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListWrapper />
      </Suspense>

      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export async function CategoryListWrapper() {
  const categories = await getCategoryOptions();

  return <CategoryList categories={categories} />;
}

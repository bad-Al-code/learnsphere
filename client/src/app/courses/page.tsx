import { Suspense } from 'react';
import { CategoryList } from './_components/category-list';
import { CoursesSkeleton } from './_components/course-skeleton';
import { CategoryListSkeleton } from './_components/courselist-skeleton';
import { CoursesList } from './_components/courses-lists';
import { DifficultyFilter } from './_components/difficulty-filter';
import { getCategoryOptions } from './actions';

interface CoursesPageProps {
  searchParams?: { page?: string; level?: string; category?: string };
}

export default async function CoursePage({ searchParams }: CoursesPageProps) {
  const categories = await getCategoryOptions();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-4xl font-bold">Explore Courses</h1>

      <Suspense fallback={<CategoryListSkeleton />}>
        <div className="mb-2 flex flex-row gap-2">
          <div className="flex-grow">
            <CategoryList categories={categories} />
          </div>
          <DifficultyFilter />
        </div>
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

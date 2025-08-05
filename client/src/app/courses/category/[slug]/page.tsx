import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CourseCard } from "../../_components/course-card";
import { PaginationControls } from "../../_components/pagination-controls";
import { getCategoryBySlug, getPublicCourses } from "../../actions";

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { page?: string; level?: string };
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<CoursesSkeleton />}>
        <CategoryCoursesList params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CategoryCoursesList({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = params;
  const currentPage = Number(searchParams?.page) || 1;
  const level = searchParams?.level;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const { results: courses, pagination } = await getPublicCourses({
    page: currentPage,
    categoryId: category.id,
    level,
  });

  return (
    <>
      <div className="mb-8">
        <Link
          href="/courses"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to all courses
        </Link>
        <h1 className="text-4xl font-bold mt-2">Courses in: {category.name}</h1>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No courses found in this category yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <PaginationControls totalPages={pagination.totalPages} />
        </>
      )}
    </>
  );
}

function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="h-12 w-full bg-muted rounded-md"></div>
          </CardContent>
          <CardFooter>
            <div className="h-10 w-1/2 bg-muted rounded-md"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

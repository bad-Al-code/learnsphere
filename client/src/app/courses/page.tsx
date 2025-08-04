import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Suspense } from "react";
import { CourseCard } from "./_components/course-card";
import { PaginationControls } from "./_components/pagination-controls";
import { getPublicCourses } from "./actions";

interface CoursesPageProps {
  searchParams?: { page?: string };
}

export default function CoursePage({ searchParams }: CoursesPageProps) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CoursesList({ searchParams }: CoursesPageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { results: courses, pagination } = await getPublicCourses({
    page: currentPage,
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

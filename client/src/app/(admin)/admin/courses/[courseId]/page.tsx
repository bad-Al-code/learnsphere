import { getCourseDetailsForAdmin } from "@/app/(admin)/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookCheck, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CourseActions } from "./_components/course-actions";
import { PriceForm } from "./_components/price-form";
import { ThumbnailUploader } from "./_components/thumbnail-uploader";

export default function AdminCourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<CourseDetailsSkeleton />}>
      <CourseDetailComponent courseId={params.courseId} />
    </Suspense>
  );
}

async function CourseDetailComponent({ courseId }: { courseId: string }) {
  const result = await getCourseDetailsForAdmin(courseId);
  if (!result.success || !result.data) {
    notFound();
  }

  const course = result.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back To all courses
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">{course.title}</h1>
            <p className="text-muted-foreground">
              by {course.instructor?.firstName} {course.instructor?.lastName}
            </p>
          </div>

          <CourseActions courseId={course.id} status={course.status} />
        </div>

        <Card className="">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-semibold">Status</div>
              <div className="col-span-2">
                <Badge
                  variant={
                    course.status === "published" ? "default" : "secondary"
                  }
                >
                  {course.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-semibold">Description</div>
              <div className="col-span-2 text-sm">
                {course.description || "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {course.modules.map((module: any, index: number) => (
                <li key={module.id} className="border-l-2 pl-4">
                  <h3 className="font-semibold">
                    Module {index + 1}: {module.title}
                  </h3>
                  <ul className="mt-2 space-y-2 pl-4">
                    {module.lessons.map((lesson: any) => (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {lesson.lessonType === "video" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <BookCheck className="h-4 w-4" />
                        )}
                        <span>{lesson.title}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            <ThumbnailUploader
              courseId={course.id}
              currentImageUrl={course.imageUrl}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Price</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceForm courseId={course.id} initialPrice={course.price} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-10 w-full max-w-sm bg-muted rounded-md animate-pulse"></div>
        <div className="h-10 w-20 bg-muted rounded-md animate-pulse"></div>
      </div>
      <div className="border rounded-lg">
        <div className="h-12 w-full bg-muted rounded-t-md animate-pulse"></div>
        <div className="space-y-2 p-4">
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

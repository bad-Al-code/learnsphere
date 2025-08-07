import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

export function InstructorCourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/dashboard/instructor/courses/${course.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative bg-muted">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{course.title}</h3>
          <Badge
            variant={course.status === "published" ? "default" : "secondary"}
            className="mt-2"
          >
            {course.status}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

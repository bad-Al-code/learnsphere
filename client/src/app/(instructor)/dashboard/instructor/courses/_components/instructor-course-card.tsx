import { ImageOffIcon } from "@/components/shared/imge-off-icon";
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
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOffIcon className="h-10 w-10" />
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

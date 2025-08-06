import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="h-full flex flex-col hover:border-primary/30 transition-all">
        <CardHeader>
          <AspectRatio
            ratio={16 / 9}
            className="bg-muted rounded-md shadow-2xl/10"
          >
            {course.imageUrl && (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover rounded-md"
              />
            )}
          </AspectRatio>

          <div className="flex justify-between items-center mb-2">
            <CardTitle className="line-clamp-2 leading-tight">
              {course.title}
            </CardTitle>
            <Badge variant="outline" className="capitalize flex-shrink-0">
              {course.level.replace("-", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description || "No description available."}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.instructor?.avatarUrls?.small} />
              <AvatarFallback>
                {getInitials(
                  course.instructor?.firstName,
                  course.instructor?.lastName
                )}
              </AvatarFallback>
            </Avatar>

            <span className="text-sm text-muted-foreground">
              {course.instructor
                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                : "Unknown Instructor"}
            </span>
          </div>
          <div className="font-semibold">
            {formatPrice(course.price, course.currency)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

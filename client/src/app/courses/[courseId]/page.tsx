import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Curriculum } from "../_components/curriculum";
import { EnrollButton } from "../_components/enroll-button";
import { getCourseDetails } from "../actions";

const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce(
    (acc: number, module: any) => acc + module.lessons.length,
    0
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-4 pt-4">
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src={course.instructor?.avatarUrls?.medium} />
              <AvatarFallback>
                {getInitials(
                  course.instructor?.firstName,
                  course.instructor?.lastName
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm md:text-base">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {course.instructor?.headline}
              </p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Curriculum */}
          <Curriculum modules={course.modules} />
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4 md:space-y-6">
            <AspectRatio
              ratio={16 / 9}
              className="bg-muted rounded-lg overflow-hidden"
            >
              {course.imageUrl && (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              )}
            </AspectRatio>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold">Free</h2>
              <EnrollButton courseId={course.id} />
            </div>

            <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
              <p className="font-medium">This course includes:</p>
              <ul className="list-disc list-inside">
                <li>{course.modules.length} modules</li>
                <li>{totalLessons} lessons</li>
                <li>Lifetime access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

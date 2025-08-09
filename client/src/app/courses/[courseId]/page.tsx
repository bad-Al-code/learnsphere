import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPrice, getInitials } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Curriculum } from '../_components/curriculum';
import { EnrollButton } from '../_components/enroll-button';
import { getCourseDetails } from '../actions';

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
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          <h1 className="text-3xl font-bold md:text-4xl">{course.title}</h1>
          <p className="text-muted-foreground text-base md:text-lg">
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
              <p className="text-sm font-semibold md:text-base">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">
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
              className="bg-muted overflow-hidden rounded-lg"
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
              <h2 className="text-xl font-bold md:text-2xl">
                {formatPrice(course.price, course.currency)}
              </h2>
              <EnrollButton courseId={course.id} />
            </div>

            <div className="text-muted-foreground space-y-2 border-t pt-4 text-sm">
              <p className="font-medium">This course includes:</p>
              <ul className="list-inside list-disc">
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

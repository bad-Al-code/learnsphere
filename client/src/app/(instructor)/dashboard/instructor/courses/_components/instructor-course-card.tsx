import { ImageOffIcon } from '@/components/shared/imge-off-icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Course } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';

export function InstructorCourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/dashboard/instructor/courses/${course.id}`}>
      <Card className="hover:border-foreground/30 overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-muted relative mx-2 aspect-video rounded-lg shadow-2xl/10 dark:shadow-2xl/20">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <ImageOffIcon className="h-10 w-10" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="truncate font-semibold">{course.title}</h3>
          <Badge
            variant={course.status === 'published' ? 'default' : 'secondary'}
            className="mt-2"
          >
            {course.status}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

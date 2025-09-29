import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Course } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';

const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="group hover:border-primary/30 border-border/50 cursor-pointer overflow-hidden pt-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={course.imageUrl || '/images/placeholder.svg'}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </AspectRatio>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        </div>

        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <CardTitle className="line-clamp-2 leading-tight">
              {course.title}
            </CardTitle>
            <Badge variant="outline" className="flex-shrink-0 capitalize">
              {course.level.replace('-', ' ')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grow">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {course.description || 'No description available.'}
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

            <span className="text-muted-foreground text-sm">
              {course.instructor
                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                : 'Unknown Instructor'}
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

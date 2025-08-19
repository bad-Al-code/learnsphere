import { ImageOffIcon } from '@/components/shared/imge-off-icon';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatPrice } from '@/lib/utils';
import { Course } from '@/types/course';
import { BookOpen, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function InstructorCourseCard({ course }: { course: Course }) {
  return (
    <Card className="hover:border-primary/30 flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/dashboard/courses/${course.id}`}>
        <div className="bg-muted relative aspect-video">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <ImageOffIcon className="h-10 w-10" />
            </div>
          )}

          <Badge className="absolute top-2 right-2 capitalize">
            {course.status}
          </Badge>
        </div>
      </Link>

      <CardHeader>
        <CardTitle className="truncate">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="grow space-y-3">
        <div className="text-muted-foreground flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.enrollmentCount} students
          </div>

          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.modules?.length || 0} modules
          </div>
        </div>

        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {course.averageRating?.toFixed(1) || 'No rating'}
          </div>

          <div>{formatPrice(course.price, course.currency)}</div>
        </div>

        <div>
          <div className="text-muted-foreground mb-1 flex justify-between text-xs">
            <span>Completion Rate</span>
            <span>{course.completionRate || 0}%</span>
          </div>

          <Progress value={course.completionRate || 0} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground text-xs">
        Updated{' '}
        {course.updatedAt
          ? new Date(course.updatedAt).toLocaleDateString()
          : 'recently'}
      </CardFooter>
    </Card>
  );
}

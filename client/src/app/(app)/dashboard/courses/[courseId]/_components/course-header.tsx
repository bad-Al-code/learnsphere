import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CourseHeaderProps {
  title: string;
  description: string | null;
}

export function CourseHeader({ title, description }: CourseHeaderProps) {
  return (
    <div>
      <div className="flex items-center text-sm">
        <Link
          href="/dashboard/courses"
          className="text-muted-foreground hover:underline"
        >
          My Courses
        </Link>
        <ChevronRight className="text-muted-foreground mx-1 h-4 w-4" />
        <span className="truncate font-semibold">{title}</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}

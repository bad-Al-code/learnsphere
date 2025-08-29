import { PaginationControls } from '@/components/shared/pagination-controls';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCourseAssignments } from '../../actions';
import { AssignmentFilters } from './assignment-filters';
import { AssignmentsList } from './assignment-list';
import { AssignmentToolbar } from './assignment-toolbar';
interface AssignmentsDataProps {
  courseId: string;
  searchParams: { [key: string]: string | string[] | undefined };
  moduleOptions: { label: string; value: string }[];
}

export default async function AssignmentsDataComponent({
  courseId,
  searchParams,
  moduleOptions,
}: AssignmentsDataProps) {
  const options = {
    courseId: courseId,
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    status:
      typeof searchParams.status === 'string'
        ? (searchParams.status as 'draft' | 'published')
        : undefined,
    moduleId:
      typeof searchParams.moduleId === 'string'
        ? searchParams.moduleId
        : undefined,
    page: Number(searchParams.page) || 1,
    limit: 10,
  };

  const { results, pagination } = await getCourseAssignments(options);

  return (
    <div className="space-y-2">
      <AssignmentFilters moduleOptions={moduleOptions} />
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Manage all assignments for this course.
          </CardDescription>
          <CardAction>
            <AssignmentToolbar
              moduleOptions={moduleOptions}
              courseId={courseId}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <AssignmentsList
            initialAssignments={results}
            courseId={courseId}
            moduleOptions={moduleOptions}
          />
        </CardContent>
      </Card>
      <PaginationControls totalPages={pagination.totalPages} />
    </div>
  );
}

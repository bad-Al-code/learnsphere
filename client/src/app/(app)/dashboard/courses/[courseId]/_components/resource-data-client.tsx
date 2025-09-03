import { PaginationControls } from '@/components/shared/pagination-controls';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCourseResources } from '../../actions';
import { ResourcesList } from './resource-list';

interface ResourcesTabProps {
  courseId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResourceDataClient({
  courseId,
  searchParams,
}: ResourcesTabProps) {
  const page = Number(searchParams?.resourcePage) || 1;
  const { results, pagination } = await getCourseResources(courseId, page);

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Course Resources</CardTitle>
          <CardDescription>
            Manage downloadable materials and external links for students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourcesList initialResources={results} courseId={courseId} />
        </CardContent>
      </Card>
      <PaginationControls totalPages={pagination.totalPages} />
    </div>
  );
}

import { PageHeader } from '../../_components/page-header';

export default function SingleAssignmentPage({
  params,
}: {
  params: { assignmentId: string };
}) {
  return (
    <div className="space-y-4">
      <PageHeader
        title={`Assignment: ${params.assignmentId}`}
        description="Work on your submission here."
      />
      <div className="rounded-lg border p-4">
        <p>Assignment content and submission UI.</p>
      </div>
    </div>
  );
}

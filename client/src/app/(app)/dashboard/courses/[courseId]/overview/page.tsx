import { Suspense } from 'react';
import { getCourseOverviewData } from '../../actions';
import {
  AssignmentStatus,
  AssignmentStatusSkeleton,
} from './_components/assignment-status';
import {
  ModulePerformance,
  ModulePerformanceSkeleton,
} from './_components/module-performance';
import {
  OverviewStatCards,
  OverviewStatCardsSkeleton,
} from './_components/overview-stat-cards';
import {
  RecentActivity,
  RecentActivitySkeleton,
} from './_components/recent-activity';
import {
  StudentsNeedingAttention,
  StudentsNeedingAttentionSkeleton,
} from './_components/student-needing-attention';
import {
  TopPerformers,
  TopPerformersSkeleton,
} from './_components/top-performance';

export default function CourseOverviewPage({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<CourseOverviewPageSkeleton />}>
      <PageContent courseId={params.courseId} />
    </Suspense>
  );
}

async function PageContent({ courseId }: { courseId: string }) {
  const overviewData = await getCourseOverviewData(courseId);

  return (
    <div className="space-y-6">
      <OverviewStatCards courseId={courseId} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity data={overviewData.recentActivity} />
        </div>
        <div>
          <TopPerformers data={overviewData.topPerformers} />
        </div>
      </div>

      <ModulePerformance data={overviewData.modulePerformance} />
      <AssignmentStatus data={overviewData.assignmentStatus} />
      <StudentsNeedingAttention data={overviewData.studentsNeedingAttention} />
    </div>
  );
}

export function CourseOverviewPageSkeleton() {
  return (
    <div className="space-y-6">
      <OverviewStatCardsSkeleton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivitySkeleton />
        </div>
        <div>
          <TopPerformersSkeleton />
        </div>
      </div>

      <ModulePerformanceSkeleton />
      <AssignmentStatusSkeleton />
      <StudentsNeedingAttentionSkeleton />
    </div>
  );
}

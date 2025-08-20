import { Suspense } from 'react';
import { getCourseOverviewData } from '../../actions';
import {
  AssignmentStatus,
  AssignmentStatusSkeleton,
} from './assignment-status';
import { AISummaryCard, AISummaryCardSkeleton } from './course-ai-summary-card';
import {
  ModulePerformance,
  ModulePerformanceSkeleton,
} from './module-performance';
import {
  OverviewStatCards,
  OverviewStatCardsSkeleton,
} from './overview-stat-cards';
import { RecentActivity, RecentActivitySkeleton } from './recent-activity';
import {
  StudentsNeedingAttention,
  StudentsNeedingAttentionSkeleton,
} from './student-needing-attention';
import { TopPerformers, TopPerformersSkeleton } from './top-performance';

export default function OverviewTab({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<OverviewTabSkeleton />}>
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
        <div className="space-y-6 lg:col-span-2">
          <AISummaryCard />
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

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <OverviewStatCardsSkeleton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AISummaryCardSkeleton />
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

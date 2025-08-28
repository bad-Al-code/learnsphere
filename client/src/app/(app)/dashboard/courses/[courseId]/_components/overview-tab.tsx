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

export async function OverviewTab({ courseId }: { courseId: string }) {
  const data = await getCourseOverviewData(courseId);

  return (
    <div className="space-y-2">
      <OverviewStatCards data={data.stats} />

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <AISummaryCard />
          <RecentActivity data={data.recentActivity} />
        </div>
        <div>
          <TopPerformers data={data.topPerformers} />
        </div>
      </div>

      <ModulePerformance data={data.modulePerformance} />
      <AssignmentStatus data={data.assignmentStatus} />
      <StudentsNeedingAttention data={data.studentsNeedingAttention} />
    </div>
  );
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-2">
      <OverviewStatCardsSkeleton />

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
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

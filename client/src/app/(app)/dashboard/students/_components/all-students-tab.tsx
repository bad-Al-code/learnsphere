import {
  AllStudentsTable,
  AllStudentsTableSkeleton,
} from './all-students-table';
import {
  GradeDistributionChart,
  GradeDistributionChartSkeleton,
} from './grade-distribution';
import {
  StudentActivityTrends,
  StudentActivityTrendsSkeleton,
} from './student-activity-trends';
import {
  StudentsNeedingAttention,
  StudentsNeedingAttentionSkeleton,
} from './student-needing-attention';

export async function AllStudentsTab() {
  return (
    <div className="space-y-6">
      <AllStudentsTable />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentActivityTrends />
        <GradeDistributionChart />
      </div>

      <StudentsNeedingAttention />
    </div>
  );
}

export function AllStudentsTabSkeleton() {
  return (
    <div className="space-y-6">
      <AllStudentsTableSkeleton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentActivityTrendsSkeleton />
        <GradeDistributionChartSkeleton />
      </div>

      <StudentsNeedingAttentionSkeleton />
    </div>
  );
}

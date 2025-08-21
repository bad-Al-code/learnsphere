import { AtRiskStudents, AtRiskStudentsSkeleton } from './student-at-risk-list';
import {
  StudentTopPerformers,
  StudentTopPerformersSkeleton,
} from './student-top-performance-list';

export async function StudentPerformanceTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <StudentTopPerformers />
      <AtRiskStudents />
    </div>
  );
}

export function StudentPerformanceTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <StudentTopPerformersSkeleton />
      <AtRiskStudentsSkeleton />
    </div>
  );
}

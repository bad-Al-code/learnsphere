import {
  AssignmentPerformance,
  AssignmentPerformanceSkeleton,
} from './assignment-performance';
import {
  CoursePerformance,
  CoursePerformanceSkeleton,
} from './course-performance';

export async function CourseAnalysisTab() {
  return (
    <div className="space-y-2">
      <CoursePerformance />
      <AssignmentPerformance />
    </div>
  );
}

export function CourseAnalysisTabSkeleton() {
  return (
    <div className="space-y-2">
      <CoursePerformanceSkeleton />
      <AssignmentPerformanceSkeleton />
    </div>
  );
}

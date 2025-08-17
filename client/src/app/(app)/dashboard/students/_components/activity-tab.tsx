import {
  StudentActivityLog,
  StudentActivityLogSkeleton,
} from './student-activity-log';

export async function ActivityLogTab() {
  return <StudentActivityLog />;
}

export function ActivityLogTabSkeleton() {
  return <StudentActivityLogSkeleton />;
}

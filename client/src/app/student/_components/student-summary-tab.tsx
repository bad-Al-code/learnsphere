import { MyCoursesTab, MyCoursesTabSkeleton } from './course-list';
import { StatCardsRow, StatCardsRowSkeleton } from './mini-stats-card';
import { QuickActions, QuickActionsSkeleton } from './quick-actions';
import { StudyGoals, StudyGoalsSkeleton } from './study-goals';
import { WelcomeHeader, WelcomeHeaderSkeleton } from './welcome-header';

export function SummaryTab() {
  return (
    <div className="space-y-2">
      <WelcomeHeader />
      <StatCardsRow />
      <StudyGoals />
      <MyCoursesTab />
      <QuickActions />
    </div>
  );
}

export function SummaryTabSkeleton() {
  return (
    <div className="space-y-2">
      <WelcomeHeaderSkeleton />
      <StatCardsRowSkeleton />
      <StudyGoalsSkeleton />
      <MyCoursesTabSkeleton />
      <QuickActionsSkeleton />
    </div>
  );
}

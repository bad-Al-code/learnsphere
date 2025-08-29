import { ClassLeaderboard } from './_components/class-leaderboard';
import { MyCoursesTab } from './_components/course-list';
import {
  EngagementHeatmap,
  LearningProgressChart,
} from './_components/dashboard-charts';
import InsightTab from './_components/insight-tab';
import { StatCardsRow } from './_components/mini-stats-card';
import { QuickActions } from './_components/quick-actions';
import { StudyGoals } from './_components/study-goals';
import { WelcomeHeader } from './_components/welcome-header';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-4">
      <WelcomeHeader />
      <StatCardsRow />
      <QuickActions />
      <StudyGoals />
      <LearningProgressChart />
      <EngagementHeatmap />
      <MyCoursesTab />
      <ClassLeaderboard />
      <InsightTab />
    </div>
  );
}

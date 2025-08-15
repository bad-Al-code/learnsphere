import { QuickActions, QuickActionsSkeleton } from './quick-actions';
import { RecentActivity, RecentActivitySkeleton } from './recent-activity';

interface DashboardTabLayoutProps {
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode;
}

export function DashboardTabLayout({
  mainContent,
  sideContent,
}: DashboardTabLayoutProps) {
  return (
    <div className="mt-6 space-y-8">
      {mainContent}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>{sideContent || <QuickActions />}</div>
      </div>
    </div>
  );
}

export function DashboardTabLayoutSkeleton({
  mainContent,
  sideContent,
}: DashboardTabLayoutProps) {
  return (
    <div className="mt-6 space-y-8">
      {mainContent}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivitySkeleton />
        </div>
        <div>{sideContent || <QuickActionsSkeleton />}</div>
      </div>
    </div>
  );
}

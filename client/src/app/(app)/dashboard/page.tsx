import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardHeader } from '../_components/dashboard-header';

export default function DashboardPage() {
  return (
    <div className="">
      <DashboardHeader
        title="Dashboard"
        description="Here's what's happening with your courses today."
      />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            This is the new instructor dashboard. More widgets and analytics
            will be added here soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Our next step will be to build the main layout with a responsive
            sidebar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

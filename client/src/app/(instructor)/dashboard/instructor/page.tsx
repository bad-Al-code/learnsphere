import { getCoursesByIds } from '@/app/courses/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { IndianRupeeIcon, Users } from 'lucide-react';
import { AnalyticsChart } from '../../_components/analytics-chart';
import { getInstructorAnalytics } from '../../actions';

export default async function InstructorDashboardPage() {
  const analyticsData = await getInstructorAnalytics();

  let chartData = [];
  if (analyticsData?.chartData && analyticsData.chartData.length > 0) {
    const courseIds = analyticsData.chartData.map((item: any) => item.courseId);

    const courses = await getCoursesByIds(courseIds);

    chartData = analyticsData.chartData.map((item: any) => ({
      name:
        courses
          .find((c: any) => c.id === item.courseId)
          ?.title.substring(0, 15) || 'Unknown',
      total: item.studentCount,
    }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupeeIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(analyticsData?.totalRevenue)}
            </div>
            <p className="text-muted-foreground text-xs">
              Total earnings from all courses. (Coming soon)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analyticsData?.totalStudents?.toLocaleString() ?? '0'}
            </div>
            <p className="text-muted-foreground text-xs">
              Unique students across all your courses.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students per Course</CardTitle>
          <CardDescription>
            A breakdown of student enrollment across your most popular courses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <AnalyticsChart data={chartData} />
          ) : (
            <p className="text-muted-foreground text-sm">
              No student data yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Students</CardTitle>
          <CardDescription>
            Your 5 most recent student enrollments will be shown here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">(Feature coming soon)</p>
        </CardContent>
      </Card>
    </div>
  );
}

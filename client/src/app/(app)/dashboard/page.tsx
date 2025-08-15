import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { BookOpen, IndianRupee, Star, Users } from 'lucide-react';
import { Suspense } from 'react';
import {
  CoursePerformanceChart,
  CoursePerformanceChartSkeleton,
} from '../_components/course-performance-chart';
import { DashboardHeader } from '../_components/dashboard-header';
import {
  EnrollmentChart,
  EnrollmentChartSkeleton,
} from '../_components/enrollment-chart';
import {
  RevenueBreakdownChart,
  RevenueBreakdownChartSkeleton,
} from '../_components/revenue-breakdown-chart';
import { StatCard } from '../_components/stat-card';
import {
  getCoursePerformanceData,
  getInstructorDashboardCharts,
  getInstructorDashboardStats,
  getInstructorDashboardTrends,
} from '../actions';

const CHANGE_DESCRIPTION = 'from last month';

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<StatsGridSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}

async function DashboardStats() {
  const [stats, trends, chartsData, performanceData] = await Promise.all([
    getInstructorDashboardStats(),
    getInstructorDashboardTrends(),
    getInstructorDashboardCharts(),
    getCoursePerformanceData(),
  ]);

  return (
    <div className="">
      <DashboardHeader
        title="Dashboard"
        description="Here's what's happening with your courses today."
      />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.value.toLocaleString()}
          change={{
            value: stats.totalStudents.change,
            description: CHANGE_DESCRIPTION,
          }}
          icon={Users}
          iconBgColor="bg-sky-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue.value)}
          change={{
            value: stats.totalRevenue.change,
            description: CHANGE_DESCRIPTION,
          }}
          icon={IndianRupee}
          iconBgColor="bg-emerald-500"
        />
        <StatCard
          title="Active Courses"
          value={stats.activeCourses.value}
          change={{
            value: stats.activeCourses.change,
            description: CHANGE_DESCRIPTION,
          }}
          icon={BookOpen}
          iconBgColor="bg-amber-500"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.value}
          change={{
            value: stats.averageRating.change,
            description: CHANGE_DESCRIPTION,
          }}
          icon={Star}
          iconBgColor="bg-rose-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment & Revenue Trend</CardTitle>
            <CardDescription>
              Monthly enrollment and revenue over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trends.length > 0 ? (
              <EnrollmentChart data={trends} />
            ) : (
              <div className="flex h-[350px] items-center justify-center">
                <p className="text-muted-foreground">
                  Not enough data to display trends.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue sources for this quarter.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsData.breakdown.length > 0 ? (
              <RevenueBreakdownChart data={chartsData.breakdown} />
            ) : (
              <RevenueBreakdownChartSkeleton />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Performance Overview</CardTitle>
            <CardDescription>
              Completion rates and ratings for your active courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {performanceData.length > 0 ? (
              <CoursePerformanceChart data={performanceData} />
            ) : (
              <CoursePerformanceChartSkeleton />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="" icon={Users} isLoading />
        <StatCard title="" icon={IndianRupee} isLoading />
        <StatCard title="" icon={BookOpen} isLoading />
        <StatCard title="" icon={Star} isLoading />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollment Trend</CardTitle>
          <CardDescription>
            Monthly student enrollments over the last 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentChartSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

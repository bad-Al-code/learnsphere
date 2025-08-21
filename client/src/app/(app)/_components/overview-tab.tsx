import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { BookOpen, IndianRupee, Star, Users } from 'lucide-react';
import {
  getCoursePerformanceData,
  getInstructorDashboardCharts,
  getInstructorDashboardStats,
  getInstructorDashboardTrends,
} from '../actions';
import {
  CoursePerformanceChart,
  CoursePerformanceChartSkeleton,
} from './course-performance-chart';
import { DashboardTabLayout } from './dashboard-tab-layout';
import {
  DemographicsChart,
  DemographicsChartSkeleton,
} from './demographic-chart';
import { DeviceUsage, DeviceUsageSkeleton } from './device-usage';
import { EnrollmentChart, EnrollmentChartSkeleton } from './enrollment-chart';
import { FinancialChart, FinancialChartSkeleton } from './financial-chart';
import {
  RevenueBreakdownChart,
  RevenueBreakdownChartSkeleton,
} from './revenue-breakdown-chart';
import { StatCard } from './stat-card';

const CHANGE_DESCRIPTION = 'from last month';

export async function OverviewTab() {
  const [stats, trends, chartsData, performanceData] = await Promise.all([
    getInstructorDashboardStats(),
    getInstructorDashboardTrends(),
    getInstructorDashboardCharts(),
    getCoursePerformanceData(),
  ]);

  const mainContent = (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              <EnrollmentChartSkeleton />
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

      <div className="">
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

      <div className="lg:grid-cols grid grid-cols-1 gap-2 md:gap-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>
              Revenue, expenses, and profit trends over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartsData.financials.length > 0 ? (
              <FinancialChart data={chartsData.financials} />
            ) : (
              <FinancialChartSkeleton />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsData.demographics.length > 0 ? (
              <DemographicsChart data={chartsData.demographics} />
            ) : (
              <DemographicsChartSkeleton />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsData.deviceUsage.length > 0 ? (
              <DeviceUsage data={chartsData.deviceUsage} />
            ) : (
              <DeviceUsageSkeleton />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-1 h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>

      <div className="lg:grid-cols grid grid-cols-1 gap-2 md:gap-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

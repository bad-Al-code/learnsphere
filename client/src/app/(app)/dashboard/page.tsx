import { formatPrice } from '@/lib/utils';
import { BookOpen, IndianRupee, Star, Users } from 'lucide-react';
import { DashboardHeader } from '../_components/dashboard-header';
import { StatCard } from '../_components/stat-card';
import { getInstructorDashboardStats } from '../actions';

const CHANGE_DESCRIPTION = 'from last month';

export default async function DashboardPage() {
  const stats = await getInstructorDashboardStats();

  return (
    <div className="">
      <DashboardHeader
        title="Dashboard"
        description="Here's what's happening with your courses today."
      />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8">
        <p className="text-muted-foreground">
          Charts and recent activity will be displayed here next.
        </p>
      </div>
    </div>
  );
}

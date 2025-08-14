import { formatPrice } from '@/lib/utils';
import { BookOpen, IndianRupee, Star, Users } from 'lucide-react';
import { DashboardHeader } from '../_components/dashboard-header';
import { StatCard } from '../_components/stat-card';
import { getInstructorDashboardStats } from '../actions';

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
          value={stats.totalStudents.toLocaleString()}
          icon={Users}
          iconBgColor="bg-sky-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={IndianRupee}
          iconBgColor="bg-emerald-500"
        />
        <StatCard
          title="Active Courses"
          value={stats.activeCourses}
          icon={BookOpen}
          iconBgColor="bg-amber-500"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
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

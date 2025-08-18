import { StatCard } from '@/app/(app)/_components/stat-card';
import { formatPrice } from '@/lib/utils';
import { BookOpen, CheckCircle, DollarSign, Users } from 'lucide-react';
import { getMyCoursePageStats } from '../actions';

export async function StatCards() {
  const stats = await getMyCoursePageStats();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        title="Total Courses"
        value={`${stats.totalCourses.value} (${stats.totalCourses.breakdown.published} Published)`}
        change={{
          value: stats.totalCourses.change,
          description: 'this month',
        }}
        icon={BookOpen}
        iconBgColor="bg-blue-500"
      />

      <StatCard
        title="Total Enrollments"
        value={stats.totalEnrollments.value.toLocaleString()}
        change={{
          value: stats.totalEnrollments.change,
          description: 'this month',
        }}
        icon={Users}
        iconBgColor="bg-sky-500"
      />

      <StatCard
        title="Avg. Completion"
        value={`${stats.avgCompletion.value}%`}
        change={{
          value: stats.avgCompletion.change,
          description: 'from last month',
        }}
        icon={CheckCircle}
        iconBgColor="bg-emerald-500"
      />

      <StatCard
        title="Total Revenue"
        value={formatPrice(stats.totalRevenue.value)}
        change={{
          value: stats.totalRevenue.change,
          description: 'this month',
        }}
        icon={DollarSign}
        iconBgColor="bg-amber-500"
      />
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard title="Total Courses" icon={BookOpen} isLoading />
      <StatCard title="Total Enrollments" icon={Users} isLoading />
      <StatCard title="Avg. Completion" icon={CheckCircle} isLoading />
      <StatCard title="Total Revenue" icon={DollarSign} isLoading />
    </div>
  );
}

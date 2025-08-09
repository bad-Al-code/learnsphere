import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, School, Users } from 'lucide-react';
import Link from 'next/link';
import { getCourseStats, getUserStats } from '../actions';

export default async function AdminDashboardPage() {
  const [userStats, courseStats] = await Promise.all([
    getUserStats(),
    getCourseStats(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.totalUsers.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/courses">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courseStats.totalCourses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users?status=pending_instructor_review">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Instructor Applications
              </CardTitle>
              <School className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{userStats.pendingApplications.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Recent activity feed will be displayed here.{' '}
              <code className="font-bold">WIP</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

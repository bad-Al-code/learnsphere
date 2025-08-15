import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AssignmentPerformanceTable,
  AssignmentPerformanceTableSkeleton,
} from './assignment-performance-table';
import {
  DashboardTabLayout,
  DashboardTabLayoutSkeleton,
} from './dashboard-tab-layout';
import {
  RecentEnrollmentsTable,
  RecentEnrollmentsTableSkeleton,
} from './recent-enrollments-table';

// Placeholder data
const assignmentPerformanceData = [
  {
    assignment: 'Data Analysis Project',
    submitted: 245,
    graded: 220,
    avgScore: 87,
    scoreLabel: 'Excellent',
    onTimePercentage: 92,
    difficulty: 'Hard' as const,
    status: 'Pending' as const,
  },
  {
    assignment: 'Web Dev Portfolio',
    submitted: 198,
    graded: 180,
    avgScore: 91,
    scoreLabel: 'Excellent',
    onTimePercentage: 89,
    difficulty: 'Medium' as const,
    status: 'Pending' as const,
  },
  {
    assignment: 'Marketing Campaign',
    submitted: 156,
    graded: 145,
    avgScore: 83,
    scoreLabel: 'Good',
    onTimePercentage: 94,
    difficulty: 'Medium' as const,
    status: 'Pending' as const,
  },
  {
    assignment: 'Design Mockups',
    submitted: 134,
    graded: 125,
    avgScore: 89,
    scoreLabel: 'Excellent',
    onTimePercentage: 87,
    difficulty: 'Easy' as const,
    status: 'Pending' as const,
  },
  {
    assignment: 'Financial Report',
    submitted: 98,
    graded: 92,
    avgScore: 85,
    scoreLabel: 'Excellent',
    onTimePercentage: 91,
    difficulty: 'Hard' as const,
    status: 'Pending' as const,
  },
  {
    assignment: 'Quiz: Fundamentals',
    submitted: 312,
    graded: 312,
    avgScore: 78,
    scoreLabel: 'Good',
    onTimePercentage: 98,
    difficulty: 'Easy' as const,
    status: 'Complete' as const,
  },
];

const recentEnrollmentsData = [
  {
    studentName: 'Alex Johnson',
    course: 'Data Science',
    enrolledDate: '2024-01-15',
    status: 'Active' as const,
    progress: 15,
  },
  {
    studentName: 'Maria Garcia',
    course: 'Web Development',
    enrolledDate: '2024-01-14',
    status: 'Active' as const,
    progress: 8,
  },
  {
    studentName: 'James Wilson',
    course: 'Digital Marketing',
    enrolledDate: '2024-01-13',
    status: 'Active' as const,
    progress: 22,
  },
  {
    studentName: 'Sophie Chen',
    course: 'Graphic Design',
    enrolledDate: '2024-01-12',
    status: 'Active' as const,
    progress: 35,
  },
  {
    studentName: 'Robert Brown',
    course: 'Financial Accounting',
    enrolledDate: '2024-01-11',
    status: 'Inactive' as const,
    progress: 5,
  },
];

export async function AnalyticsTab() {
  const mainContent = (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Assignment Performance Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of assignment submissions and scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentPerformanceTable data={assignmentPerformanceData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Enrollments</CardTitle>
          <CardDescription>
            Latest student enrollments and their progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentEnrollmentsTable data={recentEnrollmentsData} />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function AnalyticsTabSkeleton() {
  const mainContent = (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentPerformanceTableSkeleton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-52" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentEnrollmentsTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayoutSkeleton mainContent={mainContent} />;
}

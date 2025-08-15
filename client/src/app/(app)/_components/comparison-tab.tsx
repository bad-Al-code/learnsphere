import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CourseComparisonTable,
  CourseComparisonTableSkeleton,
} from './course-comparison-table';
import {
  DashboardTabLayout,
  DashboardTabLayoutSkeleton,
} from './dashboard-tab-layout';
import {
  GeoDistributionTable,
  GeoDistributionTableSkeleton,
} from './geo-distribution-table';

// Note: Placeholder data
const courseComparisonData = [
  {
    title: 'Data Science',
    imageUrl: 'https://picsum.photos/seed/1/40/40',
    students: 320,
    completionRate: 85,
    rating: 4.8,
    revenue: 28000,
  },
  {
    title: 'Web Development',
    imageUrl: 'https://picsum.photos/seed/2/40/40',
    students: 280,
    completionRate: 92,
    rating: 4.6,
    revenue: 22000,
  },
  {
    title: 'Digital Marketing',
    imageUrl: 'https://picsum.photos/seed/3/40/40',
    students: 250,
    completionRate: 78,
    rating: 4.4,
    revenue: 15000,
  },
  {
    title: 'Graphic Design',
    imageUrl: 'https://picsum.photos/seed/4/40/40',
    students: 220,
    completionRate: 88,
    rating: 4.7,
    revenue: 18000,
  },
  {
    title: 'Financial Accounting',
    imageUrl: 'https://picsum.photos/seed/5/40/40',
    students: 180,
    completionRate: 75,
    rating: 4.3,
    revenue: 12000,
  },
];

const geoDistributionData = [
  {
    region: 'North America',
    students: 450,
    revenue: 28000,
    avgRevenue: 62,
    growth: 12,
    marketShare: 36,
  },
  {
    region: 'Europe',
    students: 320,
    revenue: 19000,
    avgRevenue: 59,
    growth: 8,
    marketShare: 26,
  },
  {
    region: 'Asia',
    students: 280,
    revenue: 16000,
    avgRevenue: 57,
    growth: 15,
    marketShare: 22,
  },
  {
    region: 'South America',
    students: 120,
    revenue: 7000,
    avgRevenue: 58,
    growth: 5,
    marketShare: 10,
  },
  {
    region: 'Africa',
    students: 50,
    revenue: 3000,
    avgRevenue: 60,
    growth: 20,
    marketShare: 4,
  },
  {
    region: 'Oceania',
    students: 30,
    revenue: 2000,
    avgRevenue: 67,
    growth: 3,
    marketShare: 2,
  },
];

export async function ComparisonTab() {
  const mainContent = (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Course Performance Comparison</CardTitle>
          <CardDescription>
            Detailed comparison of all your courses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseComparisonTable data={courseComparisonData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Students and revenue by region.</CardDescription>
        </CardHeader>
        <CardContent>
          <GeoDistributionTable data={geoDistributionData} />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function ComparisonTabSkeleton() {
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
          <CourseComparisonTableSkeleton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-52" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeoDistributionTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayoutSkeleton mainContent={mainContent} />;
}

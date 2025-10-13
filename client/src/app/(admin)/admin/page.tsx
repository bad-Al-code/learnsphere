'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  BookOpen,
  Mail,
  RefreshCw,
  School,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { getCourseStats, getUserStats } from '../actions';
import { useWaitlistAnalytics } from './hooks';

function WaitlistAnalyticsDashboard() {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useWaitlistAnalytics();

  if (isLoading) {
    return <WaitlistAnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load waitlist data: {error?.message}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
                />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available.</p>
        </CardContent>
      </Card>
    );
  }

  const hasSignups = data.dailySignups && data.dailySignups.length > 0;
  const hasReferrers = data.topReferrers && data.topReferrers.length > 0;
  const hasInterests =
    data.interestDistribution && data.interestDistribution.length > 0;
  const hasRoles = data.roleDistribution && data.roleDistribution.length > 0;

  const dailySignupConfig = {
    count: {
      label: 'Sign-ups',
      color: 'var(--primary)',
    },
  } satisfies ChartConfig;

  const interestConfig = hasInterests
    ? data.interestDistribution.reduce((acc, cur) => {
        acc[cur.name] = { label: cur.name, color: cur.fill };
        return acc;
      }, {} as ChartConfig)
    : {};

  const roleConfig = hasRoles
    ? data.roleDistribution.reduce((acc, cur) => {
        acc[cur.name] = { label: cur.name, color: cur.fill };
        return acc;
      }, {} as ChartConfig)
    : {};

  return (
    <div className="space-y-2">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daily Sign-ups (Last 7 Days)</CardTitle>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh Now</TooltipContent>
          </Tooltip>
        </CardHeader>

        <CardContent>
          {!hasSignups ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No sign-up data available
              </p>
            </div>
          ) : (
            <ChartContainer config={dailySignupConfig}>
              <ResponsiveContainer>
                <BarChart data={data.dailySignups}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={false}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>

        <CardContent>
          {!hasReferrers ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground text-sm">No referrers yet</p>
            </div>
          ) : (
            <ScrollArea className="mr-3">
              <div className="max-h-96 overflow-auto">
                <div className="w-full">
                  <div className="flex border-b py-2">
                    <div className="flex-1 text-sm font-medium">Email</div>
                    <div className="w-24 text-right text-sm font-medium">
                      Referrals
                    </div>
                  </div>
                  {data.topReferrers.map((referrer) => (
                    <div
                      key={referrer.email}
                      className="flex items-center border-b py-3"
                    >
                      <div className="flex-1 text-sm font-medium">
                        {referrer.email}
                      </div>
                      <div className="w-24 text-right">
                        <span className="bg-primary/10 text-primary inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold">
                          {referrer.referrals}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interest Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasInterests ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No interest data available
              </p>
            </div>
          ) : (
            <ChartContainer config={interestConfig}>
              <ResponsiveContainer>
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={data.interestDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.interestDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="flex-wrap"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasRoles ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No role data available
              </p>
            </div>
          ) : (
            <ChartContainer config={roleConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={data.roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {data.roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WaitlistAnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  icon: Icon,
  isLoading,
  value,
  prefix = '',
}: {
  title: string;
  icon: any;
  isLoading: boolean;
  value?: number;
  prefix?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-primary/80 text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>

      <CardContent className="mt-auto">
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : value !== undefined ? (
          <div className="text-2xl font-bold">
            {prefix}
            {value.toLocaleString()}
          </div>
        ) : (
          <div className="text-muted-foreground text-2xl font-bold">-</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const {
    data: userStats,
    isLoading: isLoadingUserStats,
    isError: isUserStatsError,
    error: userStatsError,
    refetch: refetchUserStats,
  } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const {
    data: courseStats,
    isLoading: isLoadingCourseStats,
    isError: isCourseStatsError,
    error: courseStatsError,
    refetch: refetchCourseStats,
  } = useQuery({
    queryKey: ['course-stats'],
    queryFn: getCourseStats,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: waitlistAnalytics, isLoading: isLoadingWaitlist } =
    useWaitlistAnalytics();

  const hasAnyError = isUserStatsError || isCourseStatsError;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {hasAnyError && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchUserStats();
              refetchCourseStats();
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Retry Failed Queries
          </Button>
        )}
      </div>

      {hasAnyError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Stats</AlertTitle>
          <AlertDescription>
            {isUserStatsError && (
              <div>User Stats: {userStatsError?.message}</div>
            )}
            {isCourseStatsError && (
              <div>Course Stats: {courseStatsError?.message}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          icon={Users}
          isLoading={isLoadingUserStats}
          value={userStats?.totalUsers}
        />
        <StatCard
          title="Total Courses"
          icon={BookOpen}
          isLoading={isLoadingCourseStats}
          value={courseStats?.totalCourses}
        />
        <StatCard
          title="Pending Instructors"
          icon={School}
          isLoading={isLoadingUserStats}
          value={userStats?.pendingApplications}
          prefix="+"
        />
        <StatCard
          title="Waitlist Sign-ups"
          icon={Mail}
          isLoading={isLoadingWaitlist}
          value={waitlistAnalytics?.totalSignups}
        />
      </div>

      <WaitlistAnalyticsDashboard />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Recent activity feed will be displayed here.{' '}
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              WIP
            </code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import {
  CheckCircle,
  DollarSign,
  LineChart,
  LucideIcon,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from 'recharts';

interface StatCardData {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
}
interface TrendData {
  month: string;
  avgScore: number;
  activeStudents: number;
}
interface EngagementData {
  activity: string;
  students: number;
}
interface StudentPerformanceData {
  name: string;
  progress: number;
  grade: string;
  lastActive: string;
}
interface GradeData {
  grade: string;
  count: number;
}

const placeholderData = {
  stats: [
    { title: 'Average Grade', value: 'B+', change: 3, icon: CheckCircle },
    { title: 'Completion Rate', value: '85%', change: 5, icon: Users },
    { title: 'Engagement Score', value: '92', change: -2, icon: LineChart },
    { title: 'Total Revenue', value: '$12,500', change: 12, icon: DollarSign },
  ],
  trends: [
    { month: 'Jan', avgScore: 78, activeStudents: 110 },
    { month: 'Feb', avgScore: 82, activeStudents: 120 },
    { month: 'Mar', avgScore: 85, activeStudents: 115 },
    { month: 'Apr', avgScore: 84, activeStudents: 130 },
    { month: 'May', avgScore: 88, activeStudents: 140 },
  ],
  engagement: [
    { activity: 'Video Views', students: 350 },
    { activity: 'Assignments', students: 280 },
    { activity: 'Quizzes', students: 210 },
    { activity: 'Forums', students: 150 },
  ],
  topPerformers: [
    { name: 'Olivia Martin', progress: 98, grade: 'A+', lastActive: '2h ago' },
    { name: 'Liam Carter', progress: 95, grade: 'A', lastActive: '1d ago' },
    { name: 'Sophia Lee', progress: 92, grade: 'A-', lastActive: '3h ago' },
  ],
  studentsAtRisk: [
    { name: 'Noah Adams', progress: 45, grade: 'D', lastActive: '1w ago' },
    { name: 'Ava Garcia', progress: 52, grade: 'C-', lastActive: '5d ago' },
  ],
  gradeDistribution: [
    { grade: 'A', count: 45 },
    { grade: 'B', count: 68 },
    { grade: 'C', count: 52 },
    { grade: 'D', count: 28 },
    { grade: 'F', count: 12 },
  ],
};

function StatCard({ title, value, change, icon: Icon }: StatCardData) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="my-auto">
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={`flex items-center gap-1 text-xs ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {change}% from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceTrendsChart({ data }: { data: TrendData[] }) {
  const chartConfig = {
    avgScore: { label: 'Avg Score', color: 'var(--chart-1)' },
    activeStudents: { label: 'Active Students', color: 'var(--chart-2)' },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>
          Student scores and activity over 5 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={data} margin={{ left: -20, top: 10, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="activeStudents"
              type="monotone"
              fill="var(--color-activeStudents)"
              fillOpacity={0.4}
              stroke="var(--color-activeStudents)"
            />
            <Area
              dataKey="avgScore"
              type="monotone"
              fill="var(--color-avgScore)"
              fillOpacity={0.4}
              stroke="var(--color-avgScore)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EngagementDistributionChart({ data }: { data: EngagementData[] }) {
  const chartConfig = useMemo(
    () =>
      data.reduce((acc, item, i) => {
        acc[item.activity] = {
          label: item.activity,
          color: `var(--chart-${i + 1})`,
        };
        return acc;
      }, {} as ChartConfig),
    [data]
  );
  const total = useMemo(
    () => data.reduce((acc, curr) => acc + curr.students, 0),
    [data]
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Distribution</CardTitle>
        <CardDescription>Breakdown of student interactions</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="students"
              nameKey="activity"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground"
                        >
                          Activities
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              {data.map((entry) => (
                <Cell
                  key={entry.activity}
                  fill={chartConfig[entry.activity]?.color}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="activity" />}
              className="-mt-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function GradeDistributionBarChart({ data }: { data: GradeData[] }) {
  const chartConfig = {
    count: { label: 'Students', color: 'var(--chart-1)' },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Number of students per grade bracket</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <RechartsBarChart
            data={data}
            layout="vertical"
            margin={{ left: -10 }}
          >
            <YAxis
              dataKey="grade"
              type="category"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={40}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={4}
            />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function StudentPerformanceTable({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: StudentPerformanceData[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student) => (
              <TableRow key={student.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Progress value={student.progress} className="h-2" />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{student.grade}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {student.lastActive}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AnalyticsTab() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Course Analytics</h2>
          <p className="text-muted-foreground">
            Deep dive into course performance and student engagement.
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Export Report</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export Report</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderData.stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <PerformanceTrendsChart data={placeholderData.trends} />
        <EngagementDistributionChart data={placeholderData.engagement} />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <GradeDistributionBarChart data={placeholderData.gradeDistribution} />
        </div>
        <div className="lg:col-span-3">
          <StudentPerformanceTable
            title="Top Performers"
            description="Students with the highest grades and progress."
            data={placeholderData.topPerformers}
          />
        </div>
      </div>
      <StudentPerformanceTable
        title="Students at Risk"
        description="Students with low progress or grades."
        data={placeholderData.studentsAtRisk}
      />
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-7 w-16" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function PerformanceTrendsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-1 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

function EngagementDistributionChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-1 h-4 w-48" />
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Skeleton className="h-48 w-48 rounded-full" />
      </CardContent>
    </Card>
  );
}

function GradeDistributionBarChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-1 h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StudentPerformanceTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-1 h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnalyticsTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <PerformanceTrendsChartSkeleton />
        <EngagementDistributionChartSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <GradeDistributionBarChartSkeleton />
        </div>
        <div className="lg:col-span-3">
          <StudentPerformanceTableSkeleton />
        </div>
      </div>
      <StudentPerformanceTableSkeleton />
    </div>
  );
}

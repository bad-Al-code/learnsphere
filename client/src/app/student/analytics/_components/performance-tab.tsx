'use client';

import { faker } from '@faker-js/faker';
import { Download, Info, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TGpaData = {
  month: string;
  gpa: number;
};

type TSkillData = {
  skill: string;
  score: number;
};

type TLearningProgressData = {
  date: string;
  progress: number;
};

type TGradeDistribution = { grade: string; count: number };
type TTimeAllocation = { activity: string; value: number; fill: string };
type TSubmissionStatus = 'Submitted' | 'Graded' | 'Pending' | 'Overdue';
type TSubmission = {
  id: string;
  assignment: string;
  dueDate: string;
  status: TSubmissionStatus;
  grade: string;
  submissionDate: string;
};

type TCourseData = {
  id: string;
  name: string;
  progress: number;
  avgGrade: number;
  submissionRate: number;
  hours: number;
};

const gpaTrendData: TGpaData[] = [
  { month: 'Sep', gpa: 3.2 },
  { month: 'Oct', gpa: 3.4 },
  { month: 'Nov', gpa: 3.5 },
  { month: 'Dec', gpa: 3.6 },
  { month: 'Jan', gpa: 3.5 },
];

const skillsMasteryData: TSkillData[] = [
  'SQL',
  'CTEs',
  'Window Functions',
  'Optimization',
  'Database Design',
  'Data Modeling',
].map((skill) => ({
  skill,
  score: faker.number.int({ min: 60, max: 95 }),
}));

const learningProgressData: TLearningProgressData[] = Array.from(
  { length: 7 },
  (_, i) => {
    const date = faker.date.between({ from: '2024-01-01', to: '2024-04-01' });
    return {
      date: date.toISOString().split('T')[0],
      progress: faker.number.int({ min: 20 + i * 10, max: 30 + i * 10 }),
    };
  }
).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const gpaChartConfig = {
  gpa: { label: 'GPA', color: 'var(--primary)' },
} satisfies ChartConfig;

const skillsChartConfig = {
  score: { label: 'Score', color: 'var(--primary)' },
} satisfies ChartConfig;

const progressChartConfig = {
  progress: { label: 'Progress', color: 'var(--primary)' },
} satisfies ChartConfig;

const gradeDistributionData: TGradeDistribution[] = [
  'A+',
  'A',
  'A-',
  'B+',
  'B',
].map((grade) => ({
  grade,
  count: faker.number.int({ min: 2, max: 8 }),
}));

const timeAllocationData: TTimeAllocation[] = [
  { activity: 'Assignments', value: 35, fill: 'var(--primary)' },
  { activity: 'Reading', value: 20, fill: 'var(--chart-1)' },
  { activity: 'Quizzes', value: 25, fill: 'var(--chart-2)' },
  { activity: 'Discussions', value: 20, fill: 'var(--chart-3)' },
];

const assignmentSubmissionsData: TSubmission[] = Array.from(
  { length: 4 },
  (_, i) => {
    const statusOptions: TSubmissionStatus[] = [
      'Submitted',
      'Graded',
      'Pending',
      'Overdue',
    ];
    const status = statusOptions[i % statusOptions.length];
    return {
      id: faker.string.uuid(),
      assignment: faker.lorem
        .words({ min: 2, max: 4 })
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      dueDate: faker.date.future({ years: 0.1 }).toISOString().split('T')[0],
      status,
      grade:
        status === 'Graded'
          ? faker.helpers.arrayElement(['A', 'B+', 'A-', 'C'])
          : '-',
      submissionDate:
        status !== 'Pending' && status !== 'Overdue'
          ? faker.date.recent({ days: 5 }).toISOString().split('T')[0]
          : '-',
    };
  }
);

const gradeDistroConfig = { count: { label: 'Count' } } satisfies ChartConfig;
const timeAllocConfig = { value: { label: 'Time' } } satisfies ChartConfig;

const courseComparisonData: TCourseData[] = [
  'Advanced SQL',
  'Database Design',
  'Data Analysis',
  'Python Fundamentals',
].map((name) => ({
  id: faker.string.uuid(),
  name,
  progress: faker.number.int({ min: 40, max: 90 }),
  avgGrade: faker.number.int({ min: 75, max: 95 }),
  submissionRate: faker.number.int({ min: 80, max: 98 }),
  hours: faker.number.int({ min: 10, max: 25 }),
}));

function GpaTrend() {
  const currentGpa = gpaTrendData[gpaTrendData.length - 1].gpa;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>GPA Trend</CardTitle>
        </div>
        <CardDescription>Your academic performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <p className="text-4xl font-bold">{currentGpa.toFixed(1)}</p>
          <Badge
            variant="secondary"
            className="bg-emerald-500/20 text-emerald-500"
          >
            +0.5 this semester
          </Badge>
        </div>
        <ChartContainer config={gpaChartConfig} className="h-[150px] w-full">
          <LineChart accessibilityLayer data={gpaTrendData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis domain={[3, 4]} hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line dataKey="gpa" type="monotone" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function SkillsMastery() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>Skills Mastery</CardTitle>
        </div>
        <CardDescription>Your performance vs class average</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={skillsChartConfig}
          className="mx-auto aspect-square h-[220px]"
        >
          <RadarChart data={skillsMasteryData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="skill" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function LearningProgressOverTime() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <CardTitle>Learning Progress Over Time</CardTitle>
          </div>
          <CardDescription>
            Cumulative progress across all modules
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export PNG
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={progressChartConfig}
          className="h-[250px] w-full"
        >
          <LineChart accessibilityLayer data={learningProgressData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="progress"
              type="monotone"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-500">
          <Info className="h-4 w-4 text-amber-500" />
          <AlertTitle className="font-semibold">Note</AlertTitle>
          <AlertDescription>
            Activity dip detected in mid-February. Consider maintaining a
            consistent study schedule.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
}

function AssignmentGradeDistribution() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assignment Grade Distribution</CardTitle>
          <CardDescription>Your grades across all courses</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={gradeDistroConfig} className="h-[150px] w-full">
          <ResponsiveContainer>
            <BarChart data={gradeDistributionData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="grade"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--primary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-around text-center">
        <div>
          <p className="text-xl font-bold">A-</p>
          <p className="text-muted-foreground text-xs">Your Average</p>
        </div>
        <div>
          <p className="text-xl font-bold">B+</p>
          <p className="text-muted-foreground text-xs">Class Median</p>
        </div>
        <div>
          <p className="text-xl font-bold text-emerald-500">Top 25%</p>
          <p className="text-muted-foreground text-xs">Your Position</p>
        </div>
      </CardFooter>
    </Card>
  );
}

function TimeAllocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Allocation</CardTitle>
        <CardDescription>How you spend your study time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={timeAllocConfig}
          className="mx-auto aspect-square h-[150px]"
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={timeAllocationData}
                dataKey="value"
                nameKey="activity"
                innerRadius={40}
                strokeWidth={5}
              >
                {timeAllocationData.map((entry) => (
                  <Cell key={`cell-${entry.activity}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {timeAllocationData.map((item) => (
          <div key={item.activity} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <p className="text-muted-foreground">
              {item.activity}: {item.value}%
            </p>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

function AssignmentSubmissions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assignment Submissions</CardTitle>
          <CardDescription>
            Detailed submission history and feedback
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignmentSubmissionsData.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.assignment}</TableCell>
                <TableCell>{sub.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sub.status === 'Overdue' ? 'destructive' : 'secondary'
                    }
                  >
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell>{sub.grade}</TableCell>
                <TableCell>{sub.submissionDate}</TableCell>
                <TableCell>
                  {(sub.status === 'Graded' || sub.status === 'Submitted') && (
                    <Button variant="outline" size="sm">
                      View Feedback
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CourseComparison() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Comparison</CardTitle>
          <CardDescription>
            Compare your performance across enrolled courses
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Progress %</TableHead>
              <TableHead>Average Grade</TableHead>
              <TableHead>Submission Rate</TableHead>
              <TableHead>Hours Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseComparisonData.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={course.progress} className="h-2 w-16" />
                    <span>{course.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{course.avgGrade}%</TableCell>
                <TableCell>{course.submissionRate}%</TableCell>
                <TableCell>{course.hours}h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PerformanceComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <CardDescription>How you compare to your peers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-emerald-500" />

            <div>
              <p className="font-semibold text-emerald-500">Top 15% of Class</p>
              <p className="text-sm text-emerald-500/80">
                You're performing excellently!
              </p>
            </div>
          </div>

          <Badge className="bg-emerald-500">Rank #3</Badge>
        </div>

        <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
          <Card>
            <CardContent className="">
              <p className="text-2xl font-bold">87%</p>
              <p className="text-muted-foreground text-xs">Your Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="">
              <p className="text-2xl font-bold">82%</p>
              <p className="text-muted-foreground text-xs">Class Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="">
              <p className="text-2xl font-bold text-emerald-500">+5%</p>
              <p className="text-muted-foreground text-xs">Above Average</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

function GpaTrendSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="mt-2 h-[150px] w-full" />
      </CardContent>
    </Card>
  );
}

function SkillsMasterySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mx-auto aspect-square h-[220px] rounded-full" />
      </CardContent>
    </Card>
  );
}

function LearningProgressOverTimeSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-16 w-full" />
      </CardFooter>
    </Card>
  );
}

function AssignmentGradeDistributionSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[150px] w-full" />
      </CardContent>
      <CardFooter className="flex justify-around">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-16" />
      </CardFooter>
    </Card>
  );
}

function TimeAllocationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mx-auto aspect-square h-[150px] rounded-full" />
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardFooter>
    </Card>
  );
}

function AssignmentSubmissionsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function CourseComparisonSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceComparisonSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <GpaTrend />
      <SkillsMastery />

      <div className="lg:col-span-2">
        <LearningProgressOverTime />
      </div>

      <AssignmentGradeDistribution />
      <TimeAllocation />
      <div className="space-y-2 lg:col-span-2">
        <AssignmentSubmissions />
        <CourseComparison />
        <PerformanceComparison />
      </div>
    </div>
  );
}

export function PerformanceTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <GpaTrendSkeleton />
      <SkillsMasterySkeleton />
      <div className="lg:col-span-2">
        <LearningProgressOverTimeSkeleton />
      </div>
      <AssignmentGradeDistributionSkeleton />
      <TimeAllocationSkeleton />
      <div className="space-y-2 lg:col-span-2">
        <AssignmentSubmissionsSkeleton />
        <CourseComparisonSkeleton />
        <PerformanceComparisonSkeleton />
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BarChartHorizontal,
  Calendar,
  Clock,
  Eye,
  Send,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

const reportTypes = [
  'Weekly Summary',
  'Monthly Analysis',
  'Semester Overview',
  'Subject Deep Dive',
  'Performance Trends',
];
const dateRanges = ['Last Week', 'Last Month', 'Last Semester', 'Custom Range'];
const formats = [
  'PDF Report',
  'Excel Spreadsheet',
  'CSV Data',
  'Interactive Dashboard',
];

const keyMetricsData = [
  {
    title: 'This Week',
    value: '18.5h',
    label: 'Study Time',
    icon: Clock,
  },
  {
    title: 'Average Grade',
    value: '88.5%',
    label: '+2.3% from last month',
    icon: TrendingUp,
    trend: 'up',
  },
  {
    title: 'Assignments',
    value: '12/15',
    label: 'Completed',
    icon: Target,
  },
  {
    title: 'Class Rank',
    value: '#3',
    label: 'Top 15%',
    icon: Trophy,
  },
];

function ReportGenerator() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChartHorizontal className="h-5 w-5" />
          <CardTitle>Custom Report Generator</CardTitle>
        </div>
        <CardDescription>
          Generate personalized reports for your academic progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {/* Report Type */}
          <div>
            <label className="text-sm font-medium">Report Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Weekly Summary" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Date Range */}
          <div>
            <label className="text-sm font-medium">Date Range</label>
            <Select defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Format */}
          <div>
            <label className="text-sm font-medium">Format</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Export format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-2">
          <Button className="flex-1 md:flex-0">
            <Send className="h-4 w-4" />
            <span className="inline">Generate Report</span>
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline">Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Schedule Recurring</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              Schedule Recurring
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {keyMetricsData.map((metric) => (
        <Card key={metric.title}>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p
                className={cn(
                  'text-muted-foreground text-xs',
                  metric.trend === 'up' && 'text-emerald-500'
                )}
              >
                {metric.label}
              </p>
              <p className="text-sm font-medium">{metric.title}</p>
            </div>
            <metric.icon className="text-muted-foreground h-8 w-8" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReportGeneratorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Skeleton className="h-10 w-12 md:w-24" />
          <Skeleton className="h-10 w-12 md:w-24" />
          <Skeleton className="h-10 w-12 md:w-44" />
        </div>
      </CardContent>
    </Card>
  );
}

function KeyMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ReportsTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-2">
        <ReportGenerator />
        <KeyMetrics />
      </div>
    </TooltipProvider>
  );
}

export function ReportsTabSkeleton() {
  return (
    <div className="space-y-2">
      <ReportGeneratorSkeleton />
      <KeyMetricsSkeleton />
    </div>
  );
}

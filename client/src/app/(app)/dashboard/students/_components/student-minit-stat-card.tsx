'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  LucideIcon,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeDescription: string;
  icon: LucideIcon;
  iconColor?: string;
}
const placeholderData: StatCardProps[] = [
  {
    title: 'Payment Issues',
    value: '45',
    change: 10,
    changeDescription: 'from last month',
    icon: AlertCircle,
    iconColor: 'text-orange-500',
  },
];

export function StatCard({
  title,
  value,
  change,
  changeDescription,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <CardAction>
          <Icon className={cn('text-muted-foreground h-4 w-4', iconColor)} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            isPositive ? 'text-emerald-500' : 'text-rose-500'
          )}
        >
          <ChangeIcon className="h-3 w-3" />
          <span>
            {isPositive ? '+' : ''}
            {change}% {changeDescription}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-1 h-7 w-12" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function StatCardGrid() {
  const placeholderData: StatCardProps[] = [
    {
      title: 'Total Students',
      value: '1250',
      change: 15,
      changeDescription: 'from last month',
      icon: Users,
    },
    {
      title: 'Active Students',
      value: '1156',
      change: 12,
      changeDescription: 'from last month',
      icon: Users,
    },
    {
      title: 'At Risk Students',
      value: '23',
      change: 5,
      changeDescription: 'from last month',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
    },
    {
      title: 'Suspended Students',
      value: '8',
      change: -2,
      changeDescription: 'from last month',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
    },
    {
      title: 'Avg Session Time',
      value: '45m',
      change: 8,
      changeDescription: 'from last month',
      icon: Clock,
    },
    {
      title: 'Course Completion',
      value: '78%',
      change: 3,
      changeDescription: 'from last month',
      icon: CheckCircle,
    },
    {
      title: 'Payment Issues',
      value: '45',
      change: 10,
      changeDescription: 'from last month',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
    },
    {
      title: 'Help Tickets',
      value: '23',
      change: -15,
      changeDescription: 'from last month',
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {placeholderData.map((props) => (
        <StatCard key={props.title} {...props} />
      ))}
      {/* <StatCardSkeleton />
      <StatCardSkeleton /> */}
    </div>
  );
}

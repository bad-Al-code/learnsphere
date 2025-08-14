import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value?: string | number;
  change?: {
    value: number;
    description: string;
  };
  icon: LucideIcon;
  iconBgColor?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor = 'bg-primary',
  isLoading = false,
}: StatCardProps) {
  const isPositive = change && change.value >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-24" /> : title}
        </CardTitle>
        <div className={cn('text-foreground rounded-full p-2', iconBgColor)}>
          {isLoading ? (
            <Skeleton className="h-4 w-4 rounded-full" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="mb-2 h-6 w-16" />
            <Skeleton className="h-3 w-28" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className="text-muted-foreground flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex items-center gap-1 font-semibold',
                    isPositive ? 'text-emerald-500' : 'text-rose-500'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive ? '+' : '-'}
                  {change.value}%
                </span>
                {change.description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    description: string;
  };
  icon: LucideIcon;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor = 'bg-primary',
}: StatCardProps) {
  const isPositive = change && change.value >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('text-foreground rounded-full p-2', iconBgColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

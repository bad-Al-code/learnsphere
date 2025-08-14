import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
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
        {change && <p className="text-muted-foreground text-xs">{change}</p>}
      </CardContent>
    </Card>
  );
}

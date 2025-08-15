'use client';

import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Laptop, Smartphone, Tablet } from 'lucide-react';

interface DeviceUsageProps {
  data: {
    name: 'Desktop' | 'Mobile' | 'Tablet';
    users: number;
    percentage: number;
  }[];
}

const iconMap = {
  Desktop: Laptop,
  Mobile: Smartphone,
  Tablet: Tablet,
};

export function DeviceUsage({ data }: DeviceUsageProps) {
  return (
    <div className="flex h-[350px] flex-col justify-center space-y-6">
      {data.map((device) => {
        const Icon = iconMap[device.name];
        return (
          <div key={device.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{device.name}</span>
              </div>
              <div className="text-muted-foreground">
                {device.users.toLocaleString()} users
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={device.percentage} className="h-2 flex-1" />
              <span className="w-10 text-right text-sm font-semibold">
                {device.percentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DeviceUsageSkeleton() {
  return (
    <div className="flex h-[350px] flex-col justify-center space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

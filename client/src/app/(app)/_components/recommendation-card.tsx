'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Lightbulb, LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  lightbulb: Lightbulb,
};

interface RecommendationCardProps {
  title: string;
  description: string;
  iconName: keyof typeof iconMap;
  variant: 'blue' | 'green' | 'orange' | 'purple';
}

const variantClasses = {
  blue: 'border-l-blue-500 bg-blue-500/5',
  green: 'border-l-emerald-500 bg-emerald-500/5',
  orange: 'border-l-orange-500 bg-orange-500/5',
  purple: 'border-l-purple-500 bg-purple-500/5',
};

export function RecommendationCard({
  title,
  description,
  iconName,
  variant,
}: RecommendationCardProps) {
  const Icon = iconMap[iconName];

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-lg border border-l-4 p-4',
        variantClasses[variant]
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
          variantClasses[variant].replace('border-l-', 'bg-')
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

export function RecommendationCardSkeleton() {
  return (
    <div className="border-l-border flex items-start gap-4 rounded-lg border border-l-4 bg-transparent p-4">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="w-full space-y-1.5">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

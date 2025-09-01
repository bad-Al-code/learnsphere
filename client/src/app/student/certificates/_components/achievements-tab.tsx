'use client';

import { Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TAchievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  isStarred: boolean;
  earned: boolean;
};

const achievementsData: TAchievement[] = [
  {
    id: '1',
    icon: '🌅',
    title: 'Early Bird',
    description: 'Completed 5 courses ahead of schedule',
    isStarred: true,
    earned: true,
  },
  {
    id: '2',
    icon: '⚔️',
    title: 'Code Warrior',
    description: 'Submitted 50 coding assignments',
    isStarred: true,
    earned: true,
  },
  {
    id: '3',
    icon: '🤝',
    title: 'Team Player',
    description: 'Helped 10 classmates in discussions',
    isStarred: true,
    earned: true,
  },
  {
    id: '4',
    icon: '💯',
    title: 'Perfect Score',
    description: 'Achieved 100% on 3 assessments',
    isStarred: false,
    earned: false,
  },
  {
    id: '5',
    icon: '🏃‍♂️',
    title: 'Marathon Learner',
    description: 'Study streak of 30 days',
    isStarred: false,
    earned: false,
  },
];

function AchievementCard({ achievement }: { achievement: TAchievement }) {
  return (
    <Card
      className={cn('h-full', achievement.earned ? 'bg-muted/50 border' : '')}
    >
      <CardContent className="">
        <div className="flex items-start gap-3">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md text-lg">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <h3 className="flex items-center gap-1 font-semibold">
              {achievement.title}
              {achievement.isStarred && (
                <Star className="h-4 w-4 text-yellow-500" />
              )}
            </h3>
            <p className="text-muted-foreground text-sm">
              {achievement.description}
            </p>
            {achievement.earned && (
              <Badge className="mt-2 border-blue-500/30 bg-blue-500/20 text-blue-400">
                Earned
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementCardSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AchievementsTab() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {achievementsData.map((ach) => (
        <AchievementCard key={ach.id} achievement={ach} />
      ))}
    </div>
  );
}

export function AchievementsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <AchievementCardSkeleton key={i} />
      ))}
    </div>
  );
}

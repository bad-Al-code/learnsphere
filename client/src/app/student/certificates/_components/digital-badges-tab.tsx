'use client';

import { BadgeCheck, Ribbon, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

type TDigitalBadge = {
  id: string;
  title: string;
  level: 'Intermediate' | 'Advanced' | 'Expert';
  earnedDate?: string;
  progress?: number;
  color: string;
};

const badgesData: TDigitalBadge[] = [
  {
    id: '1',
    title: 'JavaScript Expert',
    level: 'Advanced',
    earnedDate: '1/15/2024',
    color: 'bg-yellow-500',
  },
  {
    id: '2',
    title: 'CSS Master',
    level: 'Expert',
    earnedDate: '2/20/2024',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    title: 'Database Guru',
    level: 'Advanced',
    earnedDate: '3/10/2024',
    color: 'bg-emerald-500',
  },
  {
    id: '4',
    title: 'React Specialist',
    level: 'Intermediate',
    progress: 75,
    color: 'bg-purple-500',
  },
  {
    id: '5',
    title: 'Full Stack Developer',
    level: 'Expert',
    progress: 45,
    color: 'bg-red-500',
  },
];

function BadgeCard({ badge }: { badge: TDigitalBadge }) {
  return (
    <Card>
      <CardContent className="">
        <div className="flex flex-col items-start gap-2">
          <div className="flex gap-2">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${badge.color}`}
            >
              <Ribbon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{badge.title}</h3>
              <p className="text-muted-foreground text-sm">{badge.level}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col items-start">
        {badge.earnedDate ? (
          <>
            <p className="text-muted-foreground mt-2 text-xs font-semibold">
              Earned {badge.earnedDate}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-3 w-3" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <BadgeCheck className="h-3 w-3" /> Verify
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-auto">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium">Progress</p>
              <p className="text-xs font-semibold">{badge.progress}%</p>
            </div>
            <Progress value={badge.progress} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function BadgeCardSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DigitalBadgesTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ribbon className="h-5 w-5" />
          <CardTitle>Digital Badge Collection</CardTitle>
        </div>
        <CardDescription>
          Showcase your skills with verified digital badges
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {badgesData.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </CardContent>
    </Card>
  );
}

export function DigitalBadgesTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <BadgeCardSkeleton />
        <BadgeCardSkeleton />
        <BadgeCardSkeleton />
        <BadgeCardSkeleton />
        <BadgeCardSkeleton />
      </CardContent>
    </Card>
  );
}

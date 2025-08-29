'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

type TInsightCardProps = {
  title: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  actionButton: React.ReactNode;
  icon: React.ReactNode;
};

type TAIStudyAssistantProps = {
  onAsk: (query: string) => void;
};

type TStudyTimeTrendProps = {
  data: { day: string; hours: number }[];
};

export const InsightCard: FC<TInsightCardProps> = ({
  title,
  level,
  description,
  actionButton,
  icon,
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle>{title}</CardTitle>
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              level === 'high'
                ? 'bg-green-500/10 text-green-500'
                : level === 'medium'
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-red-500/10 text-red-500'
            }`}
          >
            {level}
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{description}</p>
      <div className="mt-4">{actionButton}</div>
    </CardContent>
  </Card>
);

export const AIStudyAssistant: FC<TAIStudyAssistantProps> = ({ onAsk }) => (
  <Card>
    <CardHeader>
      <CardTitle>AI Study Assistant</CardTitle>
    </CardHeader>
    <CardContent>
      <Input placeholder="Ask for help with your course..." />
      <Button
        className="mt-4 w-full"
        onClick={() => onAsk('Summarize my progress')}
      >
        Ask AI
      </Button>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm">
          Summarize Progress
        </Button>
        <Button variant="outline" size="sm">
          Practice Exercises
        </Button>
        <Button variant="outline" size="sm">
          Study Plan
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const StudyTimeTrend: FC<TStudyTimeTrendProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Study Time Trend</CardTitle>
      <p className="text-muted-foreground text-sm">
        Your daily study hours this week
      </p>
    </CardHeader>
    <CardContent>
      <div className="flex h-40 items-end justify-between rounded-md border px-4 pb-4">
        {data.map(({ day, hours }) => (
          <div key={day} className="flex flex-col items-center">
            <div className="flex h-full items-end">
              <div
                className="bg-primary w-2 rounded-t-full"
                style={{ height: `${(hours / 8) * 100}%` }}
              />
            </div>
            <span className="mt-2 text-xs">{day}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const InsightCardSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-4 h-10 w-32" />
    </CardContent>
  </Card>
);

export const AIStudyAssistantSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-40" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="mt-4 h-10 w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  </Card>
);

export const StudyTimeTrendSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-2 h-4 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-40 w-full" />
    </CardContent>
  </Card>
);

const InsightTab: FC = () => {
  const studyTimeData = [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 5 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 6 },
    { day: 'Sat', hours: 2 },
    { day: 'Sun', hours: 3.5 },
  ];

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className="space-y-2">
          <h1 className="text-2xl font-bold">AI Insights Feed</h1>
          <p className="text-muted-foreground">
            Personalized notifications and recommendations
          </p>

          <div className="space-y-2">
            <InsightCard
              title="Strong Progress in React"
              level="high"
              description="You've completed 75% of React Fundamentals with a 94% average. Consider advancing to React Advanced Patterns."
              actionButton={<Button>View Next Course</Button>}
              icon={<span>🚀</span>}
            />
            <InsightCard
              title="Study Time Optimization"
              level="medium"
              description="This week you spent 40% less time than peers on SQL tuning. Consider scheduling 2 extra hours."
              actionButton={<Button>Create Study Plan</Button>}
              icon={<span>🕒</span>}
            />
            <InsightCard
              title="Peer Learning Opportunity"
              level="low"
              description="3 classmates are working on similar assignments. Join a study group to boost understanding."
              actionButton={<Button>Find Study Group</Button>}
              icon={<span>👥</span>}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <AIStudyAssistant onAsk={(query) => console.log(query)} />
            <StudyTimeTrend data={studyTimeData} />
          </div>

          <div className="mt-12 space-y-8">
            <h2 className="text-xl font-bold">Skeleton Loading States</h2>
            <InsightCardSkeleton />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <AIStudyAssistantSkeleton />
              <StudyTimeTrendSkeleton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightTab;

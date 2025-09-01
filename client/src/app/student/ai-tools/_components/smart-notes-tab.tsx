'use client';

import { Bot, FileText, Save, Sparkles, Upload } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type TInsightCategory = 'concepts' | 'actions' | 'gaps';
type TInsight = {
  title: string;
  items: string[];
  type: TInsightCategory;
};

const aiInsightsData: TInsight[] = [
  {
    title: 'Key Concepts Identified:',
    items: ['React Hooks', 'State Management', 'Component Lifecycle'],
    type: 'concepts',
  },
  {
    title: 'Suggested Study Actions:',
    items: [
      'Review useEffect dependencies',
      'Practice custom hooks creation',
      'Study performance optimization',
    ],
    type: 'actions',
  },
  {
    title: 'Knowledge Gaps:',
    items: [
      'Advanced hook patterns',
      'Context API optimization',
      'Testing strategies',
    ],
    type: 'gaps',
  },
];

function AiNoteTaking() {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>AI Note Taking</CardTitle>
        </div>
        <CardDescription>
          Smart note organization with AI-powered summarization
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          placeholder="Start taking notes... AI will help organize and summarize your content."
          className="h-full resize-none"
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">
          <Sparkles className="h-4 w-4" />
          Summarize
        </Button>
        <Button variant="outline">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </CardFooter>
    </Card>
  );
}

function AiInsights() {
  const insightColors: Record<TInsightCategory, string> = {
    concepts:
      'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20',
    actions:
      'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20',
    gaps: 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-500/20',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription>Intelligent analysis of your notes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiInsightsData.map((insight) => (
          <Card key={insight.title} className={cn(insightColors[insight.type])}>
            <CardHeader>
              <CardTitle className="text-base">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {insight.type === 'concepts' ? (
                <div className="flex flex-wrap gap-2">
                  {insight.items.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="border-current"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {insight.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function AiNoteTakingSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-full w-full" />
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}

function AiInsightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </CardContent>
    </Card>
  );
}

export function SmartNotesTab() {
  return (
    <div className="grid h-full min-h-[600px] grid-cols-1 gap-2 lg:grid-cols-2">
      <AiNoteTaking />
      <AiInsights />
    </div>
  );
}

export function SmartNotesTabSkeleton() {
  return (
    <div className="grid h-full min-h-[600px] grid-cols-1 gap-2 lg:grid-cols-2">
      <AiNoteTakingSkeleton />
      <AiInsightsSkeleton />
    </div>
  );
}

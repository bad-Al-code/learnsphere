'use client';

import { BrainCircuit, Info, Lightbulb } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/features/ai-tools/_components/common/CourseSelectionScrren';
import { usePredictiveChart } from '../hooks';

type TPrediction = {
  title: string;
  description: string;
  highlighted?: boolean;
};

type TRecommendation = {
  title: string;
  description: string;
};

const analyticsChartConfig = {
  predicted: { label: 'Predicted Performance', color: 'hsl(38 90% 50%)' },
  confidence: { label: 'Confidence Level', color: 'hsl(140 70% 40%)' },
} satisfies ChartConfig;

const performancePredictionsData: TPrediction[] = [
  {
    title: 'Grade Trajectory',
    description:
      'Based on current trends, you’re likely to achieve a 92% average by March with 88% confidence.',
    highlighted: true,
  },
  {
    title: 'Risk Assessment',
    description:
      'Low risk of falling behind. Your consistent study habits indicate strong performance ahead.',
  },
  {
    title: 'Optimization Opportunity',
    description:
      'Increasing Python practice by 2 hours weekly could boost your grade by 5-7 points.',
  },
];

const learningRecommendationsData: TRecommendation[] = [
  {
    title: 'Optimal Study Time',
    description:
      'Your peak performance occurs between 2-4 PM. Schedule challenging topics during this window.',
  },
  {
    title: 'Subject Rotation',
    description:
      'Alternating between React and Database topics improves retention by 15%.',
  },
  {
    title: 'Break Optimization',
    description:
      'Taking 10-minute breaks every 45 minutes could increase your focus time by 12%.',
  },
];

function PredictivePerformanceChart() {
  const { data, isLoading, isError, error, refetch } = usePredictiveChart();

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-48 w-full" />;
    }

    if (isError) {
      return (
        <div className="">
          <ErrorState message={error.message} onRetry={refetch} />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-muted-foreground flex h-48 w-full flex-col items-center justify-center text-center text-sm">
          <BrainCircuit className="mb-4 h-10 w-10 opacity-50" />
          <p className="font-semibold">Not Enough Data for Prediction</p>
          <p>
            Complete more graded assignments to unlock AI-powered performance
            predictions.
          </p>
        </div>
      );
    }

    return (
      <ChartContainer config={analyticsChartConfig} className="h-48 w-full">
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // fontSize={12}
          />
          <YAxis />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="predicted"
            type="monotone"
            stroke="var(--color-predicted)"
            strokeWidth={2}
            dot={true}
          />
          <Line
            dataKey="confidence"
            type="monotone"
            stroke="var(--color-confidence)"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          <CardTitle>Predictive Performance Analytics</CardTitle>
        </div>
        <CardDescription>
          AI-powered predictions of your future academic performance
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

function PerformancePredictions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          <CardTitle>Performance Predictions</CardTitle>
        </div>
        <CardDescription>
          AI-generated insights about your academic trajectory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {performancePredictionsData.map((prediction) => (
          <div
            key={prediction.title}
            className={prediction.highlighted ? 'bg-muted rounded-md p-3' : ''}
          >
            <h4 className="font-semibold">{prediction.title}</h4>
            <p className="text-muted-foreground text-sm">
              {prediction.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LearningRecommendations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          <CardTitle>Learning Recommendations</CardTitle>
        </div>
        <CardDescription>
          Personalized suggestions to optimize your learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {learningRecommendationsData.map((rec) => (
          <div key={rec.title}>
            <h4 className="font-semibold">{rec.title}</h4>
            <p className="text-muted-foreground text-sm">{rec.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PredictivePerformanceChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

function PerformancePredictionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LearningRecommendationsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AiInsightsTab() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <PredictivePerformanceChart />
      </div>
      <PerformancePredictions />
      <LearningRecommendations />
    </div>
  );
}

export function AiInsightsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <PredictivePerformanceChartSkeleton />
      </div>
      <PerformancePredictionsSkeleton />
      <LearningRecommendationsSkeleton />
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DashboardTabLayout,
  DashboardTabLayoutSkeleton,
} from './dashboard-tab-layout';
import { InsightCard, InsightCardSkeleton } from './insight-card';
import {
  RecommendationCard,
  RecommendationCardSkeleton,
} from './recommendation-card';

// Placeholder data
const insightCardsData = [
  {
    title: 'Peak Learning Hours',
    mainValue: '2-4 PM',
    description: 'Tuesday & Thursday show highest engagement',
    recommendation: 'Schedule live sessions during peak hours',
    iconName: 'clock' as const,
  },
  {
    title: 'Content Preference',
    mainValue: 'Video Lectures',
    description: '92% engagement rate, 4.7/5 rating',
    recommendation: 'Focus on video-based content creation',
    iconName: 'video' as const,
  },
  {
    title: 'Improvement Opportunity',
    mainValue: 'Discussion Forums',
    description: 'Only 45% completion rate',
    recommendation: 'Consider gamification or incentives',
    iconName: 'trendingUp' as const,
  },
];

const recommendationsData = [
  {
    title: 'Increase Video Content',
    description:
      'Your video lectures have 92% engagement. Consider converting more text-based lessons to video format.',
    iconName: 'lightbulb' as const,
    variant: 'blue' as const,
  },
  {
    title: 'Optimize Assignment Timing',
    description:
      'Students submit 15% more assignments on time when due dates are Tuesday-Thursday. Adjust your schedule accordingly.',
    iconName: 'lightbulb' as const,
    variant: 'green' as const,
  },
  {
    title: 'Improve Discussion Engagement',
    description:
      'Add discussion prompts and peer review activities to increase forum participation from 45% to target 70%.',
    iconName: 'lightbulb' as const,
    variant: 'orange' as const,
  },
  {
    title: 'Mobile Optimization',
    description:
      '32% of students use mobile devices. Ensure all content is mobile-friendly to improve accessibility.',
    iconName: 'lightbulb' as const,
    variant: 'purple' as const,
  },
];

export async function InsightsTab() {
  const mainContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {insightCardsData.map((card) => (
          <InsightCard key={card.title} {...card} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>
            Personalized suggestions to improve course performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendationsData.map((rec) => (
            <RecommendationCard key={rec.title} {...rec} />
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayout mainContent={mainContent} />;
}

export function InsightsTabSkeleton() {
  const mainContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <InsightCardSkeleton key={i} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardTabLayoutSkeleton mainContent={mainContent} />;
}

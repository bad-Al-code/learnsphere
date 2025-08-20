import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, TrendingUp } from 'lucide-react';

export function AISummaryCard() {
  const summaryText =
    "This week saw a 15% increase in student enrollment and a 5% rise in the completion rate. Engagement is strong in the 'Data Analysis' module, but 'Statistical Methods' has a higher drop-off rate.";
  const suggestionText =
    "Consider adding a supplementary video for 'Statistical Methods' to clarify complex topics.";

  return (
    <Card className="border-blue-500/50 bg-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
          <Lightbulb className="h-5 w-5" />
          AI-Powered Weekly Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{summaryText}</p>
        <div className="bg-background/50 flex items-start gap-3 rounded-lg p-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">Suggestion</h4>
            <p className="text-muted-foreground text-sm">{suggestionText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export function AISummaryCardSkeleton() {
  return (
    <Card className="border-blue-500/50 bg-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-56" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary text skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Suggestion box skeleton */}
        <div className="bg-background/50 flex items-start gap-3 rounded-lg p-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
